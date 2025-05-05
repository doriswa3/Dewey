import requests
import psycopg2

# Database connection config
DB_NAME = "dewey"
DB_USER = "ceylinerkan"
DB_PASSWORD = "CeyloDewey"
DB_HOST = "localhost"
DB_PORT = "5432"

# List of genres/subjects to fetch
subjects = [
    "science_fiction", "fiction", "romance", "fantasy", "biography", "young_adult",
    "horror", "mystery", "nonfiction", "history", "poetry", "self_help", "philosophy", 
    "art", "travel", "cooking"
]

def fetch_books_by_subject(subject, limit=100):
    url = f"https://openlibrary.org/subjects/{subject}.json?limit={limit}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get("works", [])
    else:
        print(f"Failed to fetch books for subject: {subject}")
        return []

def insert_books(books, genre, cursor):
    for book in books:
        title = book.get("title", "Unknown Title")
        authors = ", ".join([a.get("name") for a in book.get("authors", [])]) if book.get("authors") else "Unknown Author"
        description = book.get("description")
        if isinstance(description, dict):
            description = description.get("value")
        elif not isinstance(description, str):
            description = None
        
        publish_date = book.get("first_publish_year")
        if isinstance(publish_date, str):  
            if len(publish_date) == 4:  
                publish_date = f"{publish_date}-01-01"  
        elif isinstance(publish_date, int):  
            publish_date = f"{publish_date}-01-01"  
        else:
            publish_date = None

        # ISBN might be a list, so get the first ISBN if available
        isbn = None
        if book.get("isbn"):
            isbn = book.get("isbn")[0]  # Fetch the first ISBN if available
            print("isbn:" + isbn)
        
        try:
            cursor.execute("""
                INSERT INTO books (title, author, genre, description, publish_date, isbn)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT ON CONSTRAINT unique_title_author DO NOTHING;
            """, (title, authors, genre, description, publish_date, isbn))
        except Exception as e:
            print(f"Error inserting '{title}': {e}")

def main():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.autocommit = True
        cur = conn.cursor()

        for subject in subjects:
            print(f"Fetching books in genre: {subject}")
            books = fetch_books_by_subject(subject, limit=100)
            print(f"Inserting {len(books)} books...")
            insert_books(books, genre=subject, cursor=cur)

        cur.close()
        conn.close()
        print("All done!")

    except Exception as e:
        print("Connection failed:", e)

if __name__ == "__main__":
    main()
