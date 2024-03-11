import Queue from './queue.js';
/*
 * - Don't bother making an adjacency list/matrix, just traverse the board
 *   using the vector change possible for a knight for x and y
 * - Do a breadth first search from the starting positition
 * - Keep a `visited` array initialised for false with the same shape as the
 *   board
 * - Keep a `prev` array with same shape as the board and fill with the coord
 *   of the parent for each visited position so we can walk back to the start
 * - Queue the coords for the neighbours based on the possible eight vectors
 *   for the knight, excluding those outside the bounds or visited
 */

function outOfBounds(arr) {
    const checkArr = arr.some((n) => n > 7 || n < 0);
    return checkArr;
}

// Knight movement vectors expressed in matched arrays
const dx = [1, 1, 2, 2, -1, -1, -2, -2];
const dy = [2, -2, 1, -1, 2, -2, 1, -1];

// Takes an array of coordinates x and y for the start and end point on board
function findShortest(start, end) {
    const [sx, sy] = start;
    const [ex, ey] = end;

    // Check they are valid values
    if (outOfBounds([sy, sx, ex, ey])) {
        throw new Error('A position must be on the board');
    }

    // SETUP
    // A 2d array of false for visited coordinates
    const seen = Array(8)
        .fill()
        .map(() => Array(8).fill(false));

    // Mark the start as seen (nb 2d array axis are opposite)
    seen[sy][sx] = true;

    // 2d array to be filled with parent coord in path for any visited node
    const prev = Array(8)
        .fill()
        .map(() => Array(8).fill(null));

    // Bool for tracking whether end is found
    let isFound = false;

    // Queues for x and y
    const qx = new Queue();
    const qy = new Queue();

    // Add start to queues
    qx.enqueue(sx);
    qy.enqueue(sy);

    // START
    // As long as something in the queue and not yet found
    while (qx.length && !isFound) {
        // Pop off the front of queue
        const x = qx.deque();
        const y = qy.deque();

        // Check match
        if (x === ex && y === ey) {
            isFound = true;
            break;
        }

        // Add neighbours to the queue by iterating possible vectors
        for (let i = 0; i < dx.length; i++) {
            const nx = x + dx[i];
            const ny = y + dy[i];

            // if any fall out of bounds or are already visited skip;
            if (outOfBounds([nx, ny])) {
                continue;
            }

            if (seen[ny][nx]) {
                continue;
            }

            // Mark as visited, and input parent coordinates in prev
            // (nb axis are opposite in 2d arrays)
            seen[ny][nx] = true;
            prev[ny][nx] = [x, y];

            qx.enqueue(nx);
            qy.enqueue(ny);
        }
    }

    // Reconstruct the path from the prev array
    const path = [];

    if (isFound) {
        path.push([ex, ey]);

        for (
            let parent = prev[ey][ex];
            parent !== null;
            parent = prev[parent[1]][parent[0]]
        ) {
            path.push(parent);
        }
    }

    return path.reverse();
}

console.log(findShortest([0, 0], [7, 3]));
