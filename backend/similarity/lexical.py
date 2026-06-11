from collections import Counter

def get_ngrams(text, n=3):
    words = text.lower().split()
    return Counter(tuple(words[i:i+n]) for i in range(len(words)-n+1))


def ngram_overlap(text1, text2, n=3):
    a = get_ngrams(text1, n)
    b = get_ngrams(text2, n)

    if not a or not b:
        return 0.0

    intersection = sum((a & b).values())
    total = sum(a.values())

    return intersection / total