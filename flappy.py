import pygame
import random
import asyncio

pygame.init()

WIDTH = 400
HEIGHT = 600

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Flappy Bird")

clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 36)

# Colors
SKY = (135, 206, 235)
GREEN = (0, 200, 0)
YELLOW = (255, 255, 0)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)

# Bird
bird_x = 80
bird_y = 300
bird_velocity = 0

gravity = 0.25
jump_power = -5

# Pipes
pipe_width = 60
pipe_gap = 150
pipe_speed = 4

pipe_x = WIDTH
pipe_height = random.randint(120, 350)

# Clouds
clouds = [
    [50, 80, 20],
    [200, 120, 30],
    [320, 70, 25]
]

score = 0
last_score = pygame.time.get_ticks()

game_started = False
game_over = False


def reset_pipe():
    global pipe_x, pipe_height

    pipe_x = WIDTH
    pipe_height = random.randint(120, 350)


async def main():

    global bird_y
    global bird_velocity
    global pipe_x
    global score
    global game_started
    global game_over
    global last_score

    running = True

    while running:

        clock.tick(60)

        screen.fill(SKY)

        # Clouds
        for cloud in clouds:

            pygame.draw.circle(
                screen,
                WHITE,
                (cloud[0], cloud[1]),
                cloud[2]
            )

            pygame.draw.circle(
                screen,
                WHITE,
                (cloud[0] + 20, cloud[1] + 10),
                cloud[2]
            )

            cloud[0] -= 1

            if cloud[0] < -50:
                cloud[0] = WIDTH + 50

        for event in pygame.event.get():

            if event.type == pygame.QUIT:
                running = False

            if event.type == pygame.KEYDOWN:

                if event.key == pygame.K_SPACE:

                    if not game_started:
                        game_started = True

                    elif not game_over:
                        bird_velocity = jump_power

                    else:
                        # Restart
                        bird_y = 300
                        bird_velocity = 0
                        score = 0
                        reset_pipe()
                        game_over = False

        if game_started and not game_over:

            # Bird physics
            bird_velocity += gravity
            bird_y += bird_velocity

            # Pipe movement
            pipe_x -= pipe_speed

            if pipe_x < -pipe_width:
                reset_pipe()

            # Score every 2 sec
            current = pygame.time.get_ticks()

            if current - last_score > 2000:
                score += 1
                last_score = current

            # Collision
            bird_rect = pygame.Rect(
                bird_x - 15,
                bird_y - 15,
                30,
                30
            )

            top_pipe = pygame.Rect(
                pipe_x,
                0,
                pipe_width,
                pipe_height
            )

            bottom_pipe = pygame.Rect(
                pipe_x,
                pipe_height + pipe_gap,
                pipe_width,
                HEIGHT
            )

            if (
                bird_rect.colliderect(top_pipe)
                or bird_rect.colliderect(bottom_pipe)
                or bird_y < 0
                or bird_y > HEIGHT
            ):
                game_over = True

        # Draw bird
        pygame.draw.circle(
            screen,
            YELLOW,
            (bird_x, int(bird_y)),
            15
        )

        # Draw pipes
        pygame.draw.rect(
            screen,
            GREEN,
            (pipe_x, 0, pipe_width, pipe_height)
        )

        pygame.draw.rect(
            screen,
            GREEN,
            (
                pipe_x,
                pipe_height + pipe_gap,
                pipe_width,
                HEIGHT
            )
        )

        # Score
        score_text = font.render(
            f"Score: {score}",
            True,
            BLACK
        )

        screen.blit(score_text, (10, 10))

        # Start text
        if not game_started:

            text = font.render(
                "Press SPACE to Start",
                True,
                BLACK
            )

            screen.blit(text, (70, 250))

        # Game over text
        if game_over:

            over = font.render(
                "GAME OVER",
                True,
                RED
            )

            restart = font.render(
                "Press SPACE",
                True,
                BLACK
            )

            screen.blit(over, (110, 250))
            screen.blit(restart, (110, 300))

        pygame.display.flip()

        await asyncio.sleep(0)

asyncio.run(main())