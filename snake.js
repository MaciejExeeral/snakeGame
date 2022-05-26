$(document).ready(function () {
    let refreshRate = 100;
    let blockWidth = 20;
    let direction = "down";
    let snakeLength = 3;
    let scoreElement = $("#score");
    let score = 0;
    let gameOverElem = $(".gameOver");
    let width = 800;
    let height = 800;

    let snake = Array();
    let food;
    let gameLoop;
    let hasChangedDirections = false;

    /** @type {HTMLCanvasElement} */
    let gameCanvas = $("#snakeGame")[0];
    let gameContext = gameCanvas.getContext("2d");
    let gameWidth = gameCanvas.width;
    let gameHeight = gameCanvas.height;

    gameResize();

    $(window).resize(function()
    {
        gameResize();
    });

    function gameResize()
    {
        if($(window).height() < 900 || $(window).width() < 900)
        {
            width = 400;
            height = 400;
        }

        gameCanvas.width = width;
        gameCanvas.height = height;

        gameWidth = gameCanvas.width
        gameHeight = gameCanvas.height;
    }

    gameInit();

    function gameInit()
    {
        createSnake();
        createFood();

        gameLoop = setInterval(game, refreshRate);
    }

    function game()
    {
        checkCollisions();
        clearGameScreen();
        moveSnake();
        drawSnake();
        drawFood();

        hasChangedDirections = false;
    }

    function createSnake()
    {
        for(let i = snakeLength; i > 0; --i)
        {
            snake.push({ 
                x: 10, y: i,
                previousX: 0, previousY: 0
            });
        }
    }

    function createFood()
    {
        food =
        {
            x : Math.floor(Math.random() * gameWidth / blockWidth),
            y : Math.floor(Math.random() * gameHeight / blockWidth)
        }
    }
 
    function clearGameScreen()
    {
        gameContext.clearRect(0, 0, gameWidth, gameHeight);
    }

    function drawFood()
    {
        strokeRectangle(food.x, food.y, "orange");
    }

    function moveSnake()
    {
        snake[0].previousX = snake[0].x;
        snake[0].previousY = snake[0].y;

        switch(direction)
        {
            case 'up':
            {
                --snake[0].y;
                break;
            }

            case 'down':
            {
                ++snake[0].y;
                break;
            }

            case 'left':
            {
                --snake[0].x;
                break;
            }

            case 'right':
            {
                ++snake[0].x;
                break;
            }
        }
    }

    function drawSnake()
    {
        $.each(snake, function(index, snakeCell){
            if(index == 0)
            {
                strokeRectangle(snakeCell.x, snakeCell.y, "red");
            }
            else
            {
                snakeCell.previousX = snakeCell.x;
                snakeCell.previousY = snakeCell.y;

                snakeCell.x = snake[index - 1].previousX;
                snakeCell.y = snake[index - 1].previousY;

                strokeRectangle(snakeCell.x, snakeCell.y, "cyan");
            }

        });
    }

    function checkCollisions()
    {
        let headX = snake[0].x;
        let headY = snake[0].y;
            
        for (let i = 1; i < snake.length; ++i) 
        {
            if (headX == snake[i].x && headY == snake[i].y) 
            {
                gameOver();
            }
        }

        if( headX < 0 || headX >= gameWidth / blockWidth ||
            headY < 0 || headY >= gameHeight / blockWidth)
        {
            gameOver();
        }
        else if(food.x == headX && food.y == headY)
        {
            scoreElement.text(++score);

            snake.push({headX, headY});
            createFood();
        }
    }

    function strokeRectangle(x, y, color)
    {
        gameContext.fillStyle = color;
        gameContext.fillRect(x * blockWidth, y * blockWidth, blockWidth, blockWidth);
        gameContext.strokeStyle = "black";
        gameContext.strokeRect(x * blockWidth, y * blockWidth, blockWidth, blockWidth);
    }

    $(document).keydown(function(input) {
        let key = input.which;


        if(key == "87" && direction != "down" && !hasChangedDirections)
        {
            direction = "up";
            hasChangedDirections = true;
        }
        else if(key == "65" && direction != "right" && !hasChangedDirections)
        {
            direction = "left";
            hasChangedDirections = true;
        }
        else if(key == "83" && direction != "up" && !hasChangedDirections)
        {
            direction = "down";
            hasChangedDirections = true;
        }
        else if(key == "68" && direction != "left" && !hasChangedDirections)
        {
            direction = "right";
            hasChangedDirections = true;

        }
    });

    function gameOver()
    {
        gameOverElem.css("display", "inline-block");
        clearInterval(gameLoop);
    }
});