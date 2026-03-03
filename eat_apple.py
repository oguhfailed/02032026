import time


def eat_apple():
    apple = 10  # Apple has 10 bites
    print("You have an apple!")
    print(f"Apple: {'🍎' if apple > 0 else '🪨'}")
    print()

    for bite in range(1, apple + 1):
        remaining = apple - bite
        bar = "O" * remaining + "." * bite
        print(f"Bite {bite:2d}: [{bar}] - {remaining} bites left")
        time.sleep(0.3)

    print()
    print("You ate the whole apple! Yum!")
    print("Apple core remaining: |")


if __name__ == "__main__":
    eat_apple()
