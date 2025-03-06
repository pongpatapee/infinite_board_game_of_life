# Game Of Life

[Conway's game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) is one of the most famous example of a
[cellular automata](https://en.wikipedia.org/wiki/Cellular_automaton).
It's a zero-player game which consists of a grid of cells, where a cell can
either be dead or alive.

It follows these 4 basic rules:

1. Any live cell with two or three live neighbours lives on to the next generation.
2. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

## Implementation

A straight forward implementation for the game of life is using a static 2D
array with a fixed size. In each iteration, we compute the next generation of
the cells in a copy grid and replace the current grid with the copy.

This method uses `O(n)` extra memory, but the implementation is straightforward.

### Can we do better than `O(n)` space

I stumbled on [leetcode's version](https://leetcode.com/problems/game-of-life/description/)
of the game of life question, where it asked to write the game of life algorithm
in-place using `O(1)` space.

The main problem that arises when trying to perform this algorithm in-place is
the fact that the cell depends on the state of its neighbors. If we traverse the
grid and change the state of the neighbors, so will the result of the next cell.

How do we get around this? We do so by putting intermediate values that
represents a cell that was previously alive/previously dead.

For example we can give the following definitions

```
DEAD = 0
ALIVE = 1
WAS_DEAD = 2
WAS_ALIVE = -1
```

By using intermediate values, we can retain information about the previous state
while also embedding information about the new state. As we traverse the grid, a
cell dies, we can mark it as `WAS_ALIVE`, so when we're at a neighboring cell,
we can check for it's alive neighbor.

This method requires us to traverse the grid twice. Once to generate the next
generation, and the 2nd time to remark intermediate values into their
appropriate state.

### How is an infinite board implemented

What I found most interesting was, how do you implement an infinite board?

Well, we know that in a giant grid, very few of the cells are actually going to
be alive, a.k.a. a sparse matrix. We can record the positions of alive cells in
a hashset. Doing so gives us the ability to display the grid however we want, as
the positions of the cell are no longer bounded to the grid but to their
position coordinates (x, y). We can now float around in the grid, while keeping
track of the coordinates of the alive cell while using very little memory.

The question I had with this setup though, was how do we get the neighbors of
the dead cells? If we only keep track of the alive cells, how do we count the
number of alive neighbors for dead cells so we can spawn a cell based on _rule 4_?

The solution is surprisingly simple and elegant. When we go through the
coordinates of each of the alive cells, we don't count neighbors for that cell,
but instead increment the _neighbor count_ of its neighbor cells.

For example:

```python
# Instead of

num_neighbors = 0
for r, c in alive_cells:
    for dr, dc in ...:
        if grid[r + dr][c + dc] == ALIVE:
            num_neibhors += 1

if num_neighbors == some_count:
    perform_rule()


# Do this

neighbor_count = defaultdict(int)
for r, c in alive_cells:
    for dr, dc in ...:
        neighbor_count[(r + dr, c + dc)] += 1

for (r, c), count in neighbor_count.items():
    if count == some_count:
        perform_rule()

```

