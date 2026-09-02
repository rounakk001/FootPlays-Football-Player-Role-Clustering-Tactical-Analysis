"""
FastAPI backend for the Football Player Role Dashboard.
Serves pre-computed clustering results from the CSVs.
"""
import os
import sys
from pathlib import Path

# Add project root to path so we can import utils
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from dotenv import load_dotenv
from typing import Optional

from utils.cluster_mapping import CLUSTER_NAMES, CLUSTER_DESCRIPTIONS

load_dotenv()

app = FastAPI(title="Football Role Clustering API", version="1.0.0")

CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

DATA_DIR = PROJECT_ROOT / "data"

# --- Load data at startup ---
players_df: pd.DataFrame = None
centroids_df: pd.DataFrame = None


@app.on_event("startup")
def load_data():
    global players_df, centroids_df
    players_path = DATA_DIR / "players_with_role_clusters_k5_v1.csv"
    centroids_path = DATA_DIR / "cluster_centroids_k5.csv"

    if not players_path.exists():
        raise RuntimeError(f"Players data not found at {players_path}")
    if not centroids_path.exists():
        raise RuntimeError(f"Centroids data not found at {centroids_path}")

    players_df = pd.read_csv(players_path)
    centroids_df = pd.read_csv(centroids_path)


# --- Helper ---

ATTRIBUTE_COLUMNS = [
    "Agi", "Bal", "Jum", "Nat.1", "Pac", "Sta", "Str",
    "Agg", "Ant", "Bra", "Cmp", "Cnt", "Dec", "Det", "Fla",
    "Ldr", "OtB", "Pos", "Tea", "Vis", "Wor",
    "Cor", "Cro", "Dri", "Fin", "Fir", "Fre", "Hea", "Lon",
    "L Th", "Mar", "Pas", "Pen", "Tck", "Tec",
]

META_COLUMNS = ["Name", "Club", "Nat", "Height", "Weight", "Age", "CA", "PA"]


def player_row_to_dict(row: pd.Series) -> dict:
    attrs = {}
    for col in ATTRIBUTE_COLUMNS:
        if col in row.index:
            val = row[col]
            attrs[col] = round(float(val), 4) if pd.notna(val) else None

    cluster_probs = {}
    for i in range(5):
        col = f"cluster_{i}_prob"
        if col in row.index:
            cluster_probs[i] = round(float(row[col]), 4) if pd.notna(row[col]) else 0.0

    return {
        "name": row.get("Name", ""),
        "club": row.get("Club", ""),
        "nationality": row.get("Nat", ""),
        "age": int(row["Age"]) if pd.notna(row.get("Age")) else None,
        "ca": int(row["CA"]) if pd.notna(row.get("CA")) else None,
        "pa": int(row["PA"]) if pd.notna(row.get("PA")) else None,
        "height": int(row["Height"]) if pd.notna(row.get("Height")) else None,
        "weight": int(row["Weight"]) if pd.notna(row.get("Weight")) else None,
        "role_cluster": int(row["role_cluster"]),
        "cluster_probabilities": cluster_probs,
        "pc1": round(float(row["pc1"]), 4) if pd.notna(row.get("pc1")) else None,
        "pc2": round(float(row["pc2"]), 4) if pd.notna(row.get("pc2")) else None,
        "attributes": attrs,
    }


def get_similar_players(player_name: str, n: int = 5) -> list:
    player_rows = players_df[players_df["Name"] == player_name]
    if player_rows.empty:
        return []
    player_row = player_rows.iloc[0]
    cluster = int(player_row["role_cluster"])
    pc1 = float(player_row["pc1"])
    pc2 = float(player_row["pc2"])

    same_cluster = players_df[
        (players_df["role_cluster"] == cluster) & (players_df["Name"] != player_name)
    ].copy()
    same_cluster["_dist"] = np.sqrt(
        (same_cluster["pc1"] - pc1) ** 2 + (same_cluster["pc2"] - pc2) ** 2
    )
    similar = same_cluster.nsmallest(n, "_dist")
    return [
        {
            "name": r["Name"],
            "club": r["Club"],
            "ca": int(r["CA"]),
            "role_cluster": int(r["role_cluster"]),
        }
        for _, r in similar.iterrows()
    ]


# --- Routes ---

@app.get("/health")
def health():
    return {"status": "ok", "players_loaded": len(players_df) if players_df is not None else 0}


@app.get("/api/clusters")
def get_clusters():
    """Return all cluster metadata with top/bottom attributes."""
    result = []
    for cluster_id in range(5):
        cluster_attrs = centroids_df[centroids_df["cluster"] == cluster_id]
        attrs_dict = dict(zip(cluster_attrs["attr"], cluster_attrs["z"]))

        sorted_attrs = sorted(attrs_dict.items(), key=lambda x: x[1], reverse=True)
        top_attrs = [{"attr": k, "z": round(v, 3)} for k, v in sorted_attrs[:6]]
        bottom_attrs = [{"attr": k, "z": round(v, 3)} for k, v in sorted_attrs[-6:]]

        cluster_players = players_df[players_df["role_cluster"] == cluster_id]
        result.append({
            "id": cluster_id,
            "name": CLUSTER_NAMES.get(cluster_id, f"Cluster {cluster_id}"),
            "description": CLUSTER_DESCRIPTIONS.get(cluster_id, ""),
            "player_count": int(len(cluster_players)),
            "avg_ca": round(float(cluster_players["CA"].mean()), 1),
            "avg_age": round(float(cluster_players["Age"].mean()), 1),
            "top_attributes": top_attrs,
            "bottom_attributes": bottom_attrs,
        })
    return result


@app.get("/api/clusters/{cluster_id}")
def get_cluster(cluster_id: int):
    if cluster_id < 0 or cluster_id > 4:
        raise HTTPException(status_code=404, detail="Cluster not found")

    cluster_attrs = centroids_df[centroids_df["cluster"] == cluster_id]
    attrs_dict = dict(zip(cluster_attrs["attr"], cluster_attrs["z"]))
    sorted_attrs = sorted(attrs_dict.items(), key=lambda x: x[1], reverse=True)

    cluster_players = players_df[players_df["role_cluster"] == cluster_id]
    top_players = (
        cluster_players.nlargest(10, "CA")[["Name", "Club", "CA", "PA", "Age"]]
        .rename(columns={"Name": "name", "Club": "club", "CA": "ca", "PA": "pa", "Age": "age"})
        .to_dict("records")
    )

    return {
        "id": cluster_id,
        "name": CLUSTER_NAMES.get(cluster_id, f"Cluster {cluster_id}"),
        "description": CLUSTER_DESCRIPTIONS.get(cluster_id, ""),
        "player_count": int(len(cluster_players)),
        "avg_ca": round(float(cluster_players["CA"].mean()), 1),
        "avg_age": round(float(cluster_players["Age"].mean()), 1),
        "attributes": {k: round(v, 3) for k, v in sorted_attrs},
        "top_players": top_players,
    }


@app.get("/api/players")
def get_players(
    search: Optional[str] = Query(None, description="Search by player name"),
    cluster: Optional[int] = Query(None, description="Filter by cluster ID (0-4)"),
    min_ca: Optional[int] = Query(None, description="Minimum CA"),
    limit: int = Query(50, ge=1, le=683),
    offset: int = Query(0, ge=0),
):
    df = players_df.copy()

    if search:
        df = df[df["Name"].str.contains(search, case=False, na=False)]

    if cluster is not None:
        if cluster < 0 or cluster > 4:
            raise HTTPException(status_code=400, detail="Cluster must be 0-4")
        df = df[df["role_cluster"] == cluster]

    if min_ca is not None:
        df = df[df["CA"] >= min_ca]

    df = df.sort_values("CA", ascending=False)
    total = len(df)
    df = df.iloc[offset : offset + limit]

    players = [
        {
            "name": r["Name"],
            "club": r["Club"],
            "nationality": r.get("Nat", ""),
            "age": int(r["Age"]) if pd.notna(r.get("Age")) else None,
            "ca": int(r["CA"]) if pd.notna(r.get("CA")) else None,
            "pa": int(r["PA"]) if pd.notna(r.get("PA")) else None,
            "role_cluster": int(r["role_cluster"]),
            "cluster_name": CLUSTER_NAMES.get(int(r["role_cluster"]), ""),
            "pc1": round(float(r["pc1"]), 4),
            "pc2": round(float(r["pc2"]), 4),
        }
        for _, r in df.iterrows()
    ]

    return {"total": total, "players": players}


@app.get("/api/players/scatter")
def get_scatter_data():
    """Return all players with only pc1/pc2/cluster for scatter plot rendering."""
    result = []
    for _, row in players_df.iterrows():
        result.append({
            "name": row["Name"],
            "club": row["Club"],
            "ca": int(row["CA"]),
            "role_cluster": int(row["role_cluster"]),
            "cluster_name": CLUSTER_NAMES.get(int(row["role_cluster"]), ""),
            "pc1": round(float(row["pc1"]), 4),
            "pc2": round(float(row["pc2"]), 4),
        })
    return result


@app.get("/api/players/{player_name}")
def get_player(player_name: str):
    rows = players_df[players_df["Name"] == player_name]
    if rows.empty:
        raise HTTPException(status_code=404, detail="Player not found")

    player = player_row_to_dict(rows.iloc[0])
    player["similar_players"] = get_similar_players(player_name, n=5)
    return player
