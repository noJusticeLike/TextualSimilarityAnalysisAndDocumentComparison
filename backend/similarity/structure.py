def sentence_similarity(text1, text2):
    import re

    s1 = [s.strip().lower() for s in re.split(r'[.!?]', text1) if s.strip()]
    s2 = [s.strip().lower() for s in re.split(r'[.!?]', text2) if s.strip()]

    if not s1 or not s2:
        return 0.0

    matches = 0

    for sent1 in s1:
        for sent2 in s2:
            if sent1 == sent2 or sent1 in sent2 or sent2 in sent1:
                matches += 1
                break

    return matches / len(s1)