let canvas;
let ctx;
/*캔버스 셋팅*/
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")

/*게임판 크기*/
canvas.width=400;
canvas.height=700;

/* 태그에 캔버스 태그 붙이기 */
document.body.appendChild(canvas);

/* 이미지 변수들*/
let backroundImage
    , spaceshipImage
    , bulletImage
    , enemyImage
    , gameOverImage
let gameOver = false // true이면 게임 끝, false이면 게임진행 중
let score = 0;

//우주선 좌표값
let spaceshipX = canvas.width/2 - 30;
let spaceshipY = canvas.height - 60;

let bulletList = [] //총알 저장 리스트
let enemyList = [] //적군 리스트

/* 총알 초기화 값 셋팅 */
function Bullet(){
    this.x =0;
    this.y =0;
    /*우주선 시작점의 총알발생*/
    this.init = function (){
        this.x= spaceshipX + 20;
        this.y= spaceshipY;
        this.alive= true //true면 살아있는 총알 false면 죽은 총알
        //총알을 배열에 넣기
        bulletList.push(this);
    }
    this.update = function (){
        this.y -= 7;
    }
    this.checkHit = function (){
        for(let i= 0; i < enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 60){
                //점수 획득
                score ++;
                this.alive = false;
                enemyList.splice(i,1);
            }
        }
    }
}



/* 적군 랜덤 좌표 생성*/
function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max - min +1)) + min ;
    return randomNum;
}

/* 적군 값 초기화 */
function Enemy(){
    this.x =0;
    this.y =0;
    /*우주선 시작점의 총알발생*/
    this.init = function (){
        this.x= generateRandomValue(0,canvas.width - 60)
        this.y= 0;
        //총알을 배열에 넣기
        enemyList.push(this);
    }
    this.update = function (){
        this.y += 2; //적군 속도 조절
        //적군 땅에 닿으면 gameover
        if(this.y >= canvas.height - 60){
            gameOver = true;
        }
    }
}

/* 이미지 변수에 값 셋팅 */
function loadImage(){
    backroundImage = new Image();
    backroundImage.src="images/background.gif";

    spaceshipImage = new Image();
    spaceshipImage.src="images/spaceship.png";

    bulletImage = new Image()
    bulletImage.src="images/bullet.png";

    enemyImage = new Image()
    enemyImage.src="images/enemy.png";

    gameOverImage = new Image()
    gameOverImage.src="images/gameover.png";
}

let keysDown={}

//방향키 이벤트 셋팅
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode] = true;
    });
    
    document.addEventListener("keyup", function (event){
        delete keysDown[event.keyCode] /* 객체 값 삭제 */
        
        if(event.keyCode == 32){
            createBullet() // 총알 생성
        }
    })
}

/* 총알 만들기 */
function createBullet(){
    let b = new Bullet(); //총알
    b.init()
}

/* 적 만들기 */
function createEnemy(){
    const interval = setInterval(function (){
        let e = new Enemy();
        e.init();
    },1000)
}

/* 우주선 좌표값 변경*/
function update(){
    if(39 in keysDown){
        spaceshipX += 5;
    } //right
    if(37 in keysDown){
        spaceshipX -= 5;
    } //left

    //우주선이 캔버스를 벗어나지 못하게
    if(spaceshipX <= 0){
        spaceshipX = 0;
    }else if(spaceshipX >= canvas.width - 60){
        spaceshipX = canvas.width - 60;
    }

    //총알의 y좌표 업데이트 함수 호출 총알이 위로 올라가게 함
    for (let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    //적이 내려오게 하기
    for (let i=0; i< enemyList.length; i++){
        enemyList[i].update();
    }
}


/* 그리기 */
function render(){
    /* 배경 그리기 */
    ctx.drawImage(backroundImage, 0, 0, canvas.width, canvas.height);
    /*우주선 그리기*/
    ctx.drawImage(spaceshipImage, spaceshipX,spaceshipY);

    /*총알 올라가는거 그리기*/
    for (let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y)
        }
    }

    /*적이 내려오는거 그리기*/
    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y)
    }
    //스코어 그리기
    ctx.fillText(`score:${score}`, 20,20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
}

/* 화면 업데이트 */
function main(){
    if(!gameOver){
        update(); //좌표값 업데이트
        render(); //업데이트 값 그리기
        requestAnimationFrame(main) /* 애니메이션 무한 호출*/
    }else{
        ctx.drawImage(gameOverImage, 10, 100, 380, 380);
    }
}

/* 함수 부르기 */
loadImage();
setupKeyboardListener();
createEnemy();
main();

