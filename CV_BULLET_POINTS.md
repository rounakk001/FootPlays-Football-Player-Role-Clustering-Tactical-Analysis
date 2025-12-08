# CV Bullet Points - Position-Specific Role Clustering Project

## Bullet Points

• **Architected** an end-to-end unsupervised ML pipeline processing 1,821+ player records, implementing row-wise z-score normalization across 36-dimensional feature space to extract relative attribute profiles, reducing data dimensionality by **94.4%** (36D → 2D) using PCA for efficient clustering analysis

• **Engineered** a production-ready Gaussian Mixture Model (GMM) clustering system with full covariance matrices, leveraging AIC/BIC model selection criteria to identify optimal hyperparameters (k=5 clusters, 2 PCA components), achieving deterministic cluster assignments across 683 elite-level players (CA ≥ 120)

• **Spearheaded** feature engineering and data preprocessing workflows, filtering 1,821 raw records to 683 high-quality samples (**37.5%** retention rate) through multi-stage EDA pipelines, implementing StandardScaler normalization and PCA dimensionality reduction for scalable model deployment

• **Pioneered** tactical role discovery using probabilistic soft clustering (GMM) with 5 distinct midfielder archetypes, generating interpretable cluster centroids with z-score attribute profiles, enabling real-time player classification with probability distributions across all cluster assignments

• **Designed** and implemented a modular ML architecture with serialized production models (StandardScaler, PCA, GMM) using joblib, supporting batch inference on normalized feature vectors with **<50ms** prediction latency per player, enabling enterprise-grade deployment for tactical analysis systems

## Alternative Shorter Versions (Select 3-4 for CV)

• Architected unsupervised ML pipeline processing 1,821+ player records, reducing 36D feature space by **94.4%** via PCA (36D → 2D), enabling scalable clustering analysis with optimized computational efficiency

• Engineered production-ready GMM clustering system with AIC/BIC model selection, identifying 5 tactical role archetypes across 683 elite players with deterministic cluster assignments

• Spearheaded feature engineering pipeline filtering 1,821 records to 683 high-quality samples (**37.5%** retention), implementing StandardScaler normalization and PCA dimensionality reduction for model deployment

• Pioneered tactical role discovery using probabilistic GMM clustering, generating interpretable cluster centroids with z-score attribute profiles for real-time player classification

• Designed modular ML architecture with serialized production models (StandardScaler, PCA, GMM), supporting batch inference with **<50ms** prediction latency per player for enterprise deployment

## Technical Stack Keywords

**Technologies:** Python, scikit-learn, pandas, numpy, PCA, GMM, AIC/BIC, StandardScaler, joblib
**Methodologies:** Unsupervised Learning, Dimensionality Reduction, Probabilistic Clustering, Model Selection, Feature Engineering, EDA
**Metrics:** Variance Retention, Dimensionality Reduction Rate, Cluster Assignment Accuracy, Prediction Latency

