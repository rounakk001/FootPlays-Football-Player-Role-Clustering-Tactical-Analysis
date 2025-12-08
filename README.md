# Position-Specific Role Clustering in Football

An unsupervised machine learning project that discovers tactical role archetypes for midfielders using Football Manager 2024 (FM24) data. This project applies Principal Component Analysis (PCA) and Gaussian Mixture Models (GMM) to identify distinct midfielder roles based on player attributes.

### Live Link: https://player-role-dashboard.streamlit.app/
## Overview

This project analyzes midfielder players from top football leagues using FM24 data to uncover hidden tactical role patterns. By clustering players based on their normalized attribute profiles, we identify 5 distinct midfielder archetypes that represent different tactical roles and playing styles.

## Methodology

### Data Pipeline

1. **Data Cleaning** (`notebooks/eda/data_cleaning.ipynb`)
   - Loads raw FM24 player data
   - Extracts 36 player attributes (technical, physical, mental, defensive)
   - Separates metadata (Name, Club, CA, PA, Age, etc.) from features

2. **Elite Filtering** (`notebooks/eda/elite_filtering.ipynb`)
   - Filters players with CA (Current Ability) ≥ 120
   - Age ≥ 18 years
   - Focuses analysis on elite-level midfielders

3. **Feature Normalization**
   - Row-wise z-score normalization: `(attribute - player_mean) / player_std`
   - Creates relative attribute profiles (emphasizes player strengths/weaknesses)
   - Normalized features saved to `data/processed/normalized_best_features.csv`

4. **Dimensionality Reduction**
   - PCA with 2 components (selected via AIC/BIC analysis)
   - Reduces 36-dimensional attribute space to 2D for visualization

5. **Clustering**
   - Gaussian Mixture Model (GMM) with k=5 clusters
   - Full covariance matrix
   - Provides soft assignments (probability distributions)

### Alternative Approaches

The project also explores:
- **K-Medoids clustering** (`notebooks/k-mediods/`) with cosine similarity
- **Different cluster counts** (k=2, 3, 4, 5) for comparison
- **Model selection** using AIC/BIC criteria (`notebooks/pca-gmm/finding_best_k.ipynb`)

## Player Attributes

The analysis uses 36 player attributes:

**Technical Attributes:**
- Passing (Pas), Technique (Tec), Dribbling (Dri), Finishing (Fin), First Touch (Fir)
- Free Kicks (Fre), Corners (Cor), Crossing (Cro), Long Shots (Lon), Long Throws (L Th)
- Penalties (Pen), Heading (Hea)

**Physical Attributes:**
- Acceleration (Acc), Agility (Agi), Balance (Bal), Jumping (Jum)
- Pace (Pac), Stamina (Sta), Strength (Str), Natural Fitness (Nat.1)

**Mental Attributes:**
- Aggression (Agg), Anticipation (Ant), Bravery (Bra), Composure (Cmp)
- Concentration (Cnt), Decisions (Dec), Determination (Det), Flair (Fla)
- Leadership (Ldr), Off the Ball (OtB), Positioning (Pos), Teamwork (Tea)
- Vision (Vis), Work Rate (Wor)

**Defensive Attributes:**
- Marking (Mar), Tackling (Tck)

## Project Structure

```
Position-Specific-Role-Clustering-in-Football/
├── data/
│   ├── raw/
│   │   └── FM24.csv                    # Raw Football Manager 2024 data
│   └── processed/
│       ├── meta_best.csv               # Elite player metadata
│       ├── best_features.csv           # Elite player attributes
│       ├── normalized_best_features.csv # Row-normalized features
│       ├── players_with_role_clusters_k5_v1.csv  # Final results with clusters
│       └── cluster_centroids_k5.csv    # Cluster attribute profiles
├── models/
│   ├── scaler_midfield_k5.pkl          # StandardScaler model
│   ├── pca_midfield_k5.pkl             # PCA model (2 components)
│   └── gmm_midfield_k5.pkl             # GMM model (5 clusters)
├── notebooks/
│   ├── eda/
│   │   ├── data_cleaning.ipynb         # Initial data processing
│   │   ├── elite_filtering.ipynb       # CA/age filtering
│   │   └── exploring_youngsters.ipynb   # Additional EDA
│   ├── k-mediods/
│   │   ├── finding_best_k.ipynb        # K-medoids experiments
│   │   ├── k2.ipynb, k3.ipynb          # Different k values
│   │   └── elite_k2.ipynb              # Elite-focused clustering
│   └── pca-gmm/
│       ├── finding_best_k.ipynb        # Model selection (AIC/BIC)
│       ├── k3.ipynb, k4.ipynb, k5.ipynb  # Final GMM models
└── README.md
```

## Key Findings

### Five Midfielder Role Clusters (k=5)

Based on the final GMM model with 5 clusters:

**Cluster 0: Defensive Midfielder / Deep-Lying Playmaker** (147 players)
- **Strengths**: Positioning, Tackling, Composure, Passing, Decisions, Marking
- **Weaknesses**: Finishing, Dribbling, Pace, Flair, Free Kicks
- **Average CA**: 135.65 | **Average Age**: 25.63
- **Example Players**: Joshua Kimmich, Thomas Müller

**Cluster 1: Creative Playmaker** (75 players)
- **Strengths**: Passing, Vision, First Touch, Decisions, Technique, Composure
- **Weaknesses**: Aggression, Bravery, Pace, Work Rate, Natural Fitness
- **Average CA**: 141.09 | **Average Age**: 26.05
- **Example Players**: Luka Modrić, Martin Ødegaard, Thiago, İlkay Gündoğan, Frenkie de Jong

**Cluster 2: Defensive Destroyer / Ball Winner** (190 players)
- **Strengths**: Marking, Tackling, Bravery, Heading, Strength, Positioning
- **Weaknesses**: Technique, First Touch, Vision, Flair, Dribbling, Free Kicks
- **Average CA**: 134.69 | **Average Age**: 26.72
- **Example Players**: Declan Rice, Casemiro, Leon Goretzka

**Cluster 3: Box-to-Box / Attacking Midfielder** (101 players)
- **Strengths**: Pace, Off the Ball, Work Rate, Agility, Finishing, Dribbling
- **Weaknesses**: Decisions, Composure, Anticipation, Positioning, Leadership
- **Average CA**: 132.87 | **Average Age**: 23.98
- **Example Players**: Jude Bellingham, Federico Valverde

**Cluster 4: Winger / Wide Attacking Midfielder** (170 players)
- **Strengths**: Flair, Free Kicks, Corners, Dribbling, Technique, Crossing, Finishing
- **Weaknesses**: Tackling, Positioning, Marking, Bravery, Teamwork, Strength
- **Average CA**: 136.95 | **Average Age**: 25.12
- **Example Players**: Leroy Sané, Bruno Fernandes, Jamal Musiala, Pedri

## Usage

### Running the Analysis

1. **Data Preparation**
   ```python
   # Run notebooks in order:
   # 1. notebooks/eda/data_cleaning.ipynb
   # 2. notebooks/eda/elite_filtering.ipynb
   # 3. notebooks/pca-gmm/k5.ipynb (final model)
   ```

2. **Load Pre-trained Models**
   ```python
   import joblib
   import pandas as pd
   from sklearn.preprocessing import StandardScaler
   
   # Load models
   scaler = joblib.load('models/scaler_midfield_k5.pkl')
   pca = joblib.load('models/pca_midfield_k5.pkl')
   gmm = joblib.load('models/gmm_midfield_k5.pkl')
   
   # Load normalized features
   X = pd.read_csv('data/processed/normalized_best_features.csv', index_col=0)
   X_scaled = scaler.transform(X)
   X_pca = pca.transform(X_scaled)
   
   # Predict clusters
   clusters = gmm.predict(X_pca)
   probabilities = gmm.predict_proba(X_pca)
   ```

3. **View Results**
   ```python
   # Load final results
   df_results = pd.read_csv('data/processed/players_with_role_clusters_k5_v1.csv')
   
   # View cluster assignments
   print(df_results[['Name', 'Club', 'CA', 'role_cluster']].head())
   ```

### Requirements

Key Python packages:
- `pandas` - Data manipulation
- `numpy` - Numerical computing
- `scikit-learn` - Machine learning (StandardScaler, PCA, GaussianMixture)
- `matplotlib` - Visualization
- `seaborn` - Statistical visualizations
- `joblib` - Model serialization
- `kmedoids` - Alternative clustering method (optional)

## Results Interpretation

### Cluster Profiles

Each cluster represents a distinct tactical role:
- **Cluster assignments** (`role_cluster`): Hard cluster assignment (0-4)
- **Cluster probabilities** (`cluster_X_prob`): Soft assignment probabilities
- **PCA coordinates** (`pc1`, `pc2`): 2D projection for visualization

### Attribute Profiles

The `cluster_centroids_k5.csv` file contains z-scores for each attribute per cluster:
- **Positive z-scores**: Above-average attributes for that cluster
- **Negative z-scores**: Below-average attributes for that cluster
- Values indicate relative strength/weakness compared to the overall population

## Model Selection

The optimal model (k=5, 2 PCA components) was selected using:
- **AIC (Akaike Information Criterion)**: Balances model fit and complexity
- **BIC (Bayesian Information Criterion)**: Stronger penalty for complexity
- **Cluster interpretability**: Ensures meaningful tactical roles

See `notebooks/pca-gmm/finding_best_k.ipynb` for the full model selection analysis.

## Future Work

- Extend analysis to other positions (defenders, forwards, goalkeepers)
- Incorporate match statistics and performance data
- Temporal analysis to track role evolution over player careers
- Comparison with real-world tactical analysis
- Interactive visualization dashboard

## License

See LICENSE file for details.

## Acknowledgments

- Data sourced from Football Manager 2024
- Analysis inspired by tactical role analysis in modern football
