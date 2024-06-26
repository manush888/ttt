import random

class TicTacToe:
    def __init__(self):
        self.board = [' ' for _ in range(9)]
        self.current_player = 'X'

    def print_board(self):
        row1 = '| {} | {} | {} |'.format(self.board[0], self.board[1], self.board[2])
        row2 = '| {} | {} | {} |'.format(self.board[3], self.board[4], self.board[5])
        row3 = '| {} | {} | {} |'.format(self.board[6], self.board[7], self.board[8])

        print()
        print(row1)
        print(row2)
        print(row3)
        print()

    def available_moves(self):
        return [i for i, x in enumerate(self.board) if x == ' ']

    def make_move(self, move):
        if self.board[move] == ' ':
            self.board[move] = self.current_player
            self.current_player = 'O' if self.current_player == 'X' else 'X'
            return True
        return False

    def evaluate(self):
        for i in range(3):
            if self.board[i*3] == self.board[i*3+1] == self.board[i*3+2] and
self.board[i*3] != ' ':
                return 1 if self.board[i*3] == 'X' else -1
            if self.board[i] == self.board[i+3] == self.board[6] and self.board[i] !=
' ':
                return 1 if self.board[i] == 'X' else -1
        if self.board[0] == self.board[4] == self.board[8] and self.board[0] != ' ':
            return 1 if self.board[0] == 'X' else -1
        if self.board[2] == self.board[4] == self.board[6] and self.board[2] != ' ':
            return 1 if self.board[2] == 'X' else -1
        for i in range(3):
            if self.board[i*3] == self.board[i*3+1] == self.board[i*3+2] and
self.board[i*3] == ' ':
                return 0
            if self.board[i] == self.board[i+3] == self.board[6] and self.board[i] ==
' ':
                return 0
        if self.board[0] == self.board[4] == self.board[8] and self.board[0] == ' ':
            return 0
        if self.board[2] == self.board[4] == self.board[6] and self.board[2] == ' ':
            return 0
        return 0

    def minimax(self, depth, is_maximizing):
        score = self.evaluate()
        if score != 0:
            return score
        if not any(' ' in x for x in [self.board[:3], self.board[3:6],
self.board[6:]]) and score == 0:
            return 0

        moves = self.available_moves()
        scores = [-float('inf')] * len(moves)
        for i, move in enumerate(moves):
            new_board = self.board[:]
            new_board[move] = 'O' if is_maximizing else 'X'
            new_score = self.minimax(depth+1, not is_maximizing)
            scores[i] = new_score
        best_move = moves[scores.index(max(scores))]
        return max(scores) if is_maximizing else min(scores)

    def ai_move(self):
        best_score = -float('inf')
        best_move = None
        for move in self.available_moves():
            new_board = self.board[:]
            new_board[move] = 'O'
            score = self.minimax(0, False)
            if score > best_score:
                best_score = score
                best_move = move
        return best_move

    def play(self):
        while True:
            self.print_board()
            print("Available moves:", [i+1 for i in self.available_moves()])
            move = int(input("Enter your move (0-8): ")) - 1
            if not self.make_move(move):
                print("Invalid move, try again.")
                continue
            if self.evaluate() == 1:
                self.print_board()
                print("You win!")
                return
            elif self.available_moves() == []:
                self.print_board()
                print("It's a draw!")
                return
            self.current_player = 'O' if self.current_player == 'X' else 'X'
            move = self.ai_move()
            self.board[move] = 'O'
            if self.evaluate() == -1:
                self.print_board()
                print("AI wins!")
                return

if __name__ == "__main__":
    game = TicTacToe()
    game.play()