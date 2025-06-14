import pygame
import time
import random

# Initialize pygame
pygame.init()

# Define Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (213, 50, 80)
GREEN = (0, 255, 0)
BLUE = (50, 153, 213)

# Screen dimensions
WIDTH, HEIGHT = 600, 400
BLOCK_SIZE = 10
SNAKE_SPEED = 15

# Setup the window
window = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Snake Game')

# Set up the clock to control the game speed
clock = pygame.time.Clock()

# Font for the score
font_style = pygame.font.SysFont("bahnschrift", 25)

# Function to display the score
def display_score(score):
    value = font_style.render(f"Score: {score}", True, WHITE)
    window.blit(value, [0, 0])

# Function to draw the snake
def draw_snake(block_size, snake_list):
    for x in snake_list:
        pygame.draw.rect(window, GREEN, [x[0], x[1], block_size, block_size])

# Main game loop
def game_loop():
    game_over = False
    game_close = False

    # Initial position of the snake
    x = WIDTH / 2
    y = HEIGHT / 2
    x_change = 0
    y_change = 0

    snake_list = []
    snake_length = 1

    # Position of the food
    food_x = round(random.randrange(0, WIDTH - BLOCK_SIZE) / 10.0) * 10.0
    food_y = round(random.randrange(0, HEIGHT - BLOCK_SIZE) / 10.0) * 10.0

    while not game_over:

        while game_close:
            window.fill(BLUE)
            game_over_message = font_style.render("Game Over! Press Q-Quit or C-Play Again", True, RED)
            window.blit(game_over_message, [WIDTH / 6, HEIGHT / 3])
            display_score(snake_length - 1)
            pygame.display.update()

            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_q:
                        game_over = True
                        game_close = False
                    if event.key == pygame.K_c:
                        game_loop()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_over = True
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    x_change = -BLOCK_SIZE
                    y_change = 0
                elif event.key == pygame.K_RIGHT:
                    x_change = BLOCK_SIZE
                    y_change = 0
                elif event.key == pygame.K_UP:
                    y_change = -BLOCK_SIZE
                    x_change = 0
                elif event.key == pygame.K_DOWN:
                    y_change = BLOCK_SIZE
                    x_change = 0

        # Check if snake hits boundaries
        if x >= WIDTH or x < 0 or y >= HEIGHT or y < 0:
            game_close = True

        x += x_change
        y += y_change
        window.fill(BLACK)

        # Draw the food
        pygame.draw.rect(window, BLUE, [food_x, food_y, BLOCK_SIZE, BLOCK_SIZE])

        # Move the snake
        snake_head = [x, y]
        snake_list.append(snake_head)
        if len(snake_list) > snake_length:
            del snake_list[0]

        # Check if the snake hits itself
        for segment in snake_list[:-1]:
            if segment == snake_head:
                game_close = True

        draw_snake(BLOCK_SIZE, snake_list)
        display_score(snake_length - 1)

        pygame.display.update()

        # Check if snake eats food
        if x == food_x and y == food_y:
            food_x = round(random.randrange(0, WIDTH - BLOCK_SIZE) / 10.0) * 10.0
            food_y = round(random.randrange(0, HEIGHT - BLOCK_SIZE) / 10.0) * 10.0
            snake_length += 1

        # Control the speed of the snake
        clock.tick(SNAKE_SPEED)

    pygame.quit()
    quit()

# Run the game
game_loop()
