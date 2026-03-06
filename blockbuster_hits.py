blockbuster_hits = [
    {"title": "Avatar: The Way of Water", "year": 2022, "box_office": "$2.32 billion"},
    {"title": "Top Gun: Maverick",        "year": 2022, "box_office": "$1.49 billion"},
    {"title": "Avengers: Endgame",        "year": 2019, "box_office": "$2.80 billion"},
    {"title": "The Lion King",            "year": 2019, "box_office": "$1.66 billion"},
    {"title": "Spider-Man: No Way Home",  "year": 2021, "box_office": "$1.90 billion"},
    {"title": "Jurassic World",           "year": 2015, "box_office": "$1.67 billion"},
    {"title": "The Avengers",             "year": 2012, "box_office": "$1.52 billion"},
    {"title": "Titanic",                  "year": 1997, "box_office": "$2.19 billion"},
    {"title": "Star Wars: The Force Awakens", "year": 2015, "box_office": "$2.07 billion"},
    {"title": "Incredibles 2",            "year": 2018, "box_office": "$1.24 billion"},
]

def display_blockbuster_hits(movies):
    print("=" * 55)
    print(f"{'🎬 BLOCKBUSTER HITS':^55}")
    print("=" * 55)
    print(f"{'#':<4} {'Title':<35} {'Year':<6} {'Box Office'}")
    print("-" * 55)
    for i, movie in enumerate(movies, start=1):
        print(f"{i:<4} {movie['title']:<35} {movie['year']:<6} {movie['box_office']}")
    print("=" * 55)

display_blockbuster_hits(blockbuster_hits)
