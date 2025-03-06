import collections
import curses

# Implementing an infinite grid game of life


def display_grid(stdscr, live_cells, translation):
    GRID_SIZE = 15
    tr, tc = translation

    row_len = 0

    for gr in range(GRID_SIZE):
        row = "|"
        for gc in range(GRID_SIZE):
            r, c = gr - tr, gc - tc
            cell = " ■ " if (r, c) in live_cells else "   "
            row += cell + "|"
            row_len = len(row)

        stdscr.addstr(gr * 2, 0, "-" * row_len)
        stdscr.addstr(gr * 2 + 1, 0, row)
    stdscr.addstr(GRID_SIZE * 2, 0, "-" * row_len)


def get_next_gen(live_cells):

    # We're not counting the neighbor for the current cell itself
    # instead we're incrementing the count for all neighbor of current cell
    # This way dead cells will have neighbor counts as well.

    neighbor_count = collections.defaultdict(int)
    deltas = [(-1, -1), (-1, 1), (1, -1), (1, 1), (1, 0), (-1, 0), (0, -1), (0, 1)]

    for r, c in live_cells:
        for dr, dc in deltas:

            neighbor_count[(r + dr, c + dc)] += 1

    new_live_cells = set()
    for (r, c), count in neighbor_count.items():
        is_live_cell = (r, c) in live_cells

        # live cell with < 2 neighbors die
        # live cell with > 3 neighbors die

        # live cell with 2 or 3 neighbors live
        if is_live_cell and (count == 2 or count == 3):
            new_live_cells.add((r, c))

        # dead cell with 3 neighbors spawn
        elif not is_live_cell and count == 3:
            new_live_cells.add((r, c))

    return new_live_cells


def main(stdscr):
    curses.curs_set(0)  # Hide cursor
    stdscr.nodelay(1)  # Non-blocking input
    stdscr.timeout(200)  # Refresh every 200ms

    # init state
    live_cells = {(0, 1), (1, 2), (2, 0), (2, 1), (2, 2)}
    grid_translation = [0, 0]

    tick = 0
    pause = False

    while True:
        stdscr.clear()  # Clears the screen
        height, width = stdscr.getmaxyx()

        display_grid(stdscr, live_cells, grid_translation)
        if tick % 2 == 0 and not pause:
            live_cells = get_next_gen(live_cells)

        stdscr.addstr(height - 10, 0, f"Screen dimensions: {height} x {width}")
        stdscr.addstr(height - 9, 0, f"ticks: {tick}")
        stdscr.addstr(height - 8, 0, "Press 'p' to play/pause the simulation")
        stdscr.addstr(height - 7, 0, "Press 'q' to quit")

        key = stdscr.getch()
        if key == ord("q"):  # Quit on 'q'
            break

        if key == ord("p"):
            pause = not pause

        if key == curses.KEY_UP:
            grid_translation[0] -= 1
        elif key == curses.KEY_DOWN:
            grid_translation[0] += 1
        elif key == curses.KEY_RIGHT:
            grid_translation[1] += 1
        elif key == curses.KEY_LEFT:
            grid_translation[1] -= 1

        tick += 1

        stdscr.refresh()


curses.wrapper(main)
