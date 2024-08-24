export const rules = {
  c: (x, y, board, my) => {
    const d = []
    for (let i = x - 1; i >= 0; i--) {
      if (board[y][i]) {
        if (board[y][i][0] !== my) d.push([i, y])
        break
      } else {
        d.push([i, y])
      }
    }
    for (let i = x + 1; i <= 8; i++) {
      if (board[y][i]) {
        if (board[y][i][0] !== my) d.push([i, y])
        break
      } else {
        d.push([i, y])
      }
    }
    for (let i = y - 1; i >= 0; i--) {
      if (board[i][x]) {
        if (board[i][x][0] !== my) d.push([x, i])
        break
      } else {
        d.push([x, i])
      }
    }
    for (let i = y + 1; i <= 9; i++) {
      if (board[i][x]) {
        if (board[i][x][0] !== my) d.push([x, i])
        break
      } else {
        d.push([x, i])
      }
    }
    return d
  },

  m: (x, y, board, my) => {
    const d = []
    const moves = [
      { dx: 2, dy: 1, bx: 1, by: 0 }, // 向右上跳跃，蹩马腿检查右侧
      { dx: 2, dy: -1, bx: 1, by: 0 }, // 向右下跳跃，蹩马腿检查右侧
      { dx: -2, dy: 1, bx: -1, by: 0 }, // 向左上跳跃，蹩马腿检查左侧
      { dx: -2, dy: -1, bx: -1, by: 0 }, // 向左下跳跃，蹩马腿检查左侧
      { dx: 1, dy: 2, bx: 0, by: 1 }, // 向上右跳跃，蹩马腿检查上侧
      { dx: 1, dy: -2, bx: 0, by: -1 }, // 向下右跳跃，蹩马腿检查下侧
      { dx: -1, dy: 2, bx: 0, by: 1 }, // 向上左跳跃，蹩马腿检查上侧
      { dx: -1, dy: -2, bx: 0, by: -1 }, // 向下左跳跃，蹩马腿检查下侧
    ]

    moves.forEach(({ dx, dy, bx, by }) => {
      const nx = x + dx
      const ny = y + dy
      const blockX = x + bx
      const blockY = y + by

      // 检查目标位置是否在棋盘范围内
      if (nx >= 0 && nx <= 8 && ny >= 0 && ny <= 9) {
        // 检查蹩马腿的位置是否有阻挡
        if (!board[blockY]?.[blockX]) {
          // 检查目标位置是否为空或者有对方的棋子
          if (!board[ny][nx] || board[ny][nx][0] !== my) {
            d.push([nx, ny])
          }
        }
      }
    })

    return d
  },

  x: (x, y, board, my) => {
    const d = []
    const moves = [
      [2, 2],
      [2, -2],
      [-2, 2],
      [-2, -2],
    ]
    moves.forEach(([dx, dy]) => {
      const nx = x + dx
      const ny = y + dy
      const inPalace = my === 'r' ? ny >= 5 : ny <= 4
      if (nx >= 0 && nx <= 8 && ny >= 0 && ny <= 9 && inPalace) {
        const block = board[y + dy / 2]?.[x + dx / 2]
        if (!block && (!board[ny]?.[nx] || board[ny][nx][0] !== my)) {
          d.push([nx, ny])
        }
      }
    })
    return d
  },

  s: (x, y, board, my) => {
    const d = []
    const moves = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]
    moves.forEach(([dx, dy]) => {
      const nx = x + dx
      const ny = y + dy
      const inPalace =
        my === 'r'
          ? nx >= 3 && nx <= 5 && ny >= 7 && ny <= 9
          : nx >= 3 && nx <= 5 && ny >= 0 && ny <= 2
      if (inPalace && (!board[ny][nx] || board[ny][nx][0] !== my)) {
        d.push([nx, ny])
      }
    })
    return d
  },

  j: (x, y, board, my) => {
    const d = []
    const moves = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    moves.forEach(([dx, dy]) => {
      const nx = x + dx
      const ny = y + dy
      const inPalace =
        my === 'r'
          ? nx >= 3 && nx <= 5 && ny >= 7 && ny <= 9
          : nx >= 3 && nx <= 5 && ny >= 0 && ny <= 2
      if (inPalace && (!board[ny][nx] || board[ny][nx][0] !== my)) {
        d.push([nx, ny])
      }
    })
    // 检查是否可以老将见面
    const opponentGeneral = my === 'r' ? 'J' : 'j'
    const opponentY = my === 'r' ? 0 : 9
    let canSee = true
    for (let i = y - 1; i > opponentY && canSee; i--) {
      if (board[i][x]) {
        canSee = false
      }
    }
    if (canSee && board[opponentY][x] === opponentGeneral) {
      d.push([x, opponentY])
    }
    return d
  },

  p: (x, y, board, my) => {
    const d = []
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
    directions.forEach(([dx, dy]) => {
      let nx = x + dx
      let ny = y + dy
      let jumped = false
      while (nx >= 0 && nx <= 8 && ny >= 0 && ny <= 9) {
        if (board[ny][nx]) {
          if (jumped) {
            if (board[ny][nx][0] !== my) {
              d.push([nx, ny])
            }
            break
          } else {
            jumped = true
          }
        } else if (!jumped) {
          d.push([nx, ny])
        }
        nx += dx
        ny += dy
      }
    })
    return d
  },

  z: (x, y, board, my) => {
    const d = []
    const forward = my === 'r' ? -1 : 1
    const sideMoves = [
      [1, 0],
      [-1, 0],
    ]
    if ((my === 'r' && y <= 4) || (my === 'b' && y >= 5)) {
      sideMoves.forEach(([dx, dy]) => {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx <= 8 && (!board[ny][nx] || board[ny][nx][0] !== my)) {
          d.push([nx, ny])
        }
      })
    }
    const ny = y + forward
    if (ny >= 0 && ny <= 9 && (!board[ny][x] || board[ny][x][0] !== my)) {
      d.push([x, ny])
    }
    return d
  },
}

