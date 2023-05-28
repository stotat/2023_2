let points = [[0,0],[-1,0],[-2,-1],[-2,4],[-4,4],[-4,3],[-3,2.8],[-3,-4],[-2,-4],[-2,-3],[-2,-4],[-1,-4],[-1,-3],[0,-3],[0,-4],[1,-4],[1,-3],[1,-4],[2,-4],[2,-2],[6,-2],[2,-1],[1,0],[0,0],[-1,0]];
var stroke_colors = "064789-427aa1-ebf2fa-679436-a5be00".split("-").map(a=>"#"+a)
var fill_colors = "064789-427aa1-ebf2fa-679436-a5be00".split("-").map(a=>"#"+a)

// 粒子、類別
class Obj{ // 一個物件的設定
  constructor(args){ // 預設值，基本資料(包含有物件的顏色、位置、速度、大小...)
    // this.p = args.p || {x:random(width), y:random(height)} // 一個物件開始的位置
    this.p = args.p || createVector(random(width), random(height))
    // this.v = {x:random(-1,1), y:random(-1,1)} // 速度，x,y移動的速度為亂數產生-1,1之間的數字
    this.v = createVector(random(-1,1), random(-1,1)) // 產生一個x座標值為random(-1,1)
    this.size = random(5,20) // 放大倍率
    this.color = random(fill_colors) // 充滿顏色
    this.stroke = random(stroke_colors) // 線條顏色
  }
draw() // 把物件畫出來的函數
{
  push() // 重新設定，設定新的原點與顏色設定
    translate(this.p.x,this.p.y) // 原點設定在==>物件所在位置
    scale(this.v.x<0?1:-1) // 放大縮小的指令，this.v.x<0條件成立的話，則值為1，否則為-1
    fill(this.color)
    stroke(this.stroke)
    beginShape()
    for(var i=0; i<points.length-1; i=i+1){
      // line(points[i][0]*this.size,points[i][1]*this.size,points[i+1][0]*this.size,points[i+1][1]*this.size)
      vertex(points[i][0]*this.size,points[i][1]*this.size)
    }
    endShape()
  pop()
  }

  update(){ // 移動後設定位置資料值為何
    // 移動的程式碼---------------------------------------
    // this.p.x = this.p.x + this.v.x
    // this.p.y = this.p.y + this.v.y
    this.p.add(this.v) // 此行效果跟上面兩行一樣
    // -------------------------------------------    
    
    // 算出滑鼠位置的向量--------------------------------
    let mouseV = createVector(mouseX,mouseY) // 把目前滑鼠的位置轉成向量
    // let delta = mouseV.sub(this.p).limit(3) // delta值紀錄與滑鼠方向移動的單位距離，sub為向量減法，limit為每次移動的單位距離
    let delta = mouseV.sub(this.p).limit(this.v.mag()*2) //與原本物件速度有關，this.v.mag()取得物件的速度值
    this.p.add(delta)
    // --------------------------------------------

    // 碰壁的處理程式碼--------------------------------------
    if(this.p.x <= 0 || this.p.x >= width) // <0碰到左邊， >width為碰到右邊
    {
      this.v.x = -this.v.x
    }
    if(this.p.y <= 0 || this.p.y >= height) // <0碰到左邊， >width為碰到右邊
    {
      this.v.y = -this.v.y
    }
  }  

  isBallInRanger(){
    let d = dist(mouseX, mouseY, this.p.x, this.p.y) // 計算滑鼠按下的點與此物件位置之間的距離
    if(d<this.size*4){ // 4得由來：去看座標點最大的值，以此作為方框的高與寬
      return true // 代表距離有在範圍內
    }else{
      return false // 代表距離沒有在範圍內
    }
  }
}


var ball // 代表單一個物件，利用這個變數來做正在處理的物件
var balls = [] // 陣列，放所有的物件資料
var bullet
var bullets = [] 
var score = 0

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 產生幾個物件
  for(j=0; j<10; j=j+1)
  {
    ball = new Obj({}) // 產生一個新的物件，暫時放入到ball的變數中
    balls.push(ball) // 把ball物件放入到ball物件群(陣列)中
  }
}

function draw() { 
  background(220);
  // for(k=0; k<balls.length; k=k+1){
  //   ball = balls[k]
  //   ball.draw()
  //   ball.update()
  // }
  for(let ball of balls){ // 針對陣列變數，取出陣列內一個一個的物件
    ball.draw()
    ball.update()
     // 由此判斷每隻大象有沒有接觸到每一個飛彈
     for(let bullet of bullets){
      if(ball.isBallInRanger(bullet.p.x,bullet.p.y)) // 判斷ball與bullet有沒有碰觸
      {
        score = score + 1
        balls.splice(balls.indexOf(ball),1)
        bullets.splice(bullets.indexOf(bullet),1)
      }
     }
  }

  for(let bullet of bullets){ // 針對飛彈倉庫的資料，一筆一筆的顯示出來
    bullet.draw()
    bullet.update()
  }

  textSize(50)
  text(score,50,50)

  // 畫出中間的砲台--------------------------------------
  push()
    let dx = mouseX - width/2 // 滑鼠座標到中心點座標的x軸的距離
    let dy = mouseY - height/2 // 滑鼠座標到中心點座標的y軸的距離
    let angle = atan2(dy, dx) // 利用反tan算出角度

    translate(width/2, height/2)
    rotate(angle) // 讓三角形翻轉一個angle角度
    triangle(50, 0, -25, -25, -25, 25)
  pop()
  }

function mousePressed(){
  //  // 按下滑鼠產生一個物件程式碼
  // ball = new Obj({ 
  //   p:{x: mouseX, y:mouseY}
  // }) // 產生一個新物件，暫時放入ball變數中
  // balls.push(ball)

   // 按下滑鼠後，刪除該物件
  for(let ball of balls){
    if(ball.isBallInRanger()){
       // 把倉庫的這個物件刪除
       score = score + 1
       balls.splice(balls.indexOf(ball),1)
    }
  }

  bullet = new Bullet({
    r : random(10,30)

  })
  bullets.push(bullet) // 把這一筆資料放入飛彈倉庫
}
