def compute_final_score(embedding_sim, lexical_sim, structural_sim):
    """
    Strongly penalize semantic false positives
    """

    # strong penalty for weak lexical overlap
    if lexical_sim < 0.15:
        embedding_sim *= 0.35

    if lexical_sim < 0.08:
        embedding_sim *= 0.20

    score = (
        0.30 * embedding_sim +
        0.50 * lexical_sim +
        0.20 * structural_sim
    )

    return round(min(score, 1.0), 4)