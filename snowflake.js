function UpData(data) {
    jsonData = JSON.stringify(data);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
    document.cookie = `jxdata=${jsonData}; expires=${expires.toUTCString()}`;
}

const initdata = {
    Quantity: 20,
    Speed: 4.5,
    SizeT: 65,
    SizeD: 35,
    ComplexT: 17,
    ComplexD: 7,
    vertexT: 9,
    vertexD: 3,
};

const cookie = document.cookie;
const cookies = cookie.split(';');
let jxdata;
for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === 'jxdata') {
        jxdata = value;
        break;
    }
}
let jsonData
if (!jxdata) {
    UpData(initdata)
    jsonData = initdata
} else {
    jsonData = JSON.parse(jxdata);
}
let SnowflakeData = jsonData
let initdata2 = { ...SnowflakeData }

let mouseX = 0
let mouseY = 0

class Asnowflake {
    constructor(x, y, size, complex, vertex, color, direction) {
        this.x = x;
        this.y = y;
        this.distance = size;
        this.Csize = size * complex * 2;
        this.complex = complex;
        this.vertex = vertex;
        this.color = color;
        this.direction = direction

        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = this.Csize;
        this.height = this.canvas.height = this.Csize;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.translate(0.5 * this.Csize, 0.5 * this.Csize); //設定原點
        this.ctx.scale(1, 1);//縮放畫布

        this.LastPoint = []
        this.LastPoint = this.LastPoint.concat(Array(vertex).fill([0, 0]));
        this.LastPoint.push(this.direction)
        this.NowLevel = 0
    }
    NextLevel() {
        if (this.NowLevel >= this.complex) {
            return
        }
        let R = this.LastPoint[this.vertex]
        R += Math.random() * 50 + 95
        for (let i = 0; i < this.vertex; i++) {
            this.LastPoint[i] = this.drawLine(this.ctx, this.LastPoint[i][0], this.LastPoint[i][1], this.distance, R + (i * 360 / this.vertex))
        }
        this.LastPoint[this.vertex] = R
        this.NowLevel++
    }
    draw(ctxB) {
        ctxB.drawImage(this.canvas, this.x - 0.5 * this.Csize, this.y - 0.5 * this.Csize);
    }
    drawLine(ctx, x, y, length, angleInDegrees) {
        let angleInRadians = angleInDegrees * Math.PI / 180;
        let endX = x + length * Math.cos(angleInRadians);
        let endY = y + length * Math.sin(angleInRadians);
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        return [endX, endY]
    }
}
function randomRGBA() {
    var r = Math.floor(Math.random() * 100 + 156);
    var g = Math.floor(Math.random() * 100 + 156);
    var b = Math.floor(Math.random() * 100 + 156);
    var a = Math.random() * 0.3 + 0.7;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}
function GetAF() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * (SnowflakeData.SizeT - SnowflakeData.SizeD) + SnowflakeData.SizeD;
    const complex = Math.random() * (SnowflakeData.ComplexT - SnowflakeData.ComplexD) + SnowflakeData.ComplexD;
    const vertex = Math.floor(Math.random() * (SnowflakeData.vertexT - SnowflakeData.vertexD) + SnowflakeData.vertexD);
    const direction = Math.random() * 360;
    return new Asnowflake(x, y, size, complex, vertex, randomRGBA(), direction)
}
function decimalToFraction(decimal, simplify = true) {
    let numerator = decimal * 1000;
    let denominator = 1000;
    function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
    }
    if (simplify) {
        const commonFactor = gcd(numerator, denominator);
        numerator /= commonFactor;
        denominator /= commonFactor;
    }
    return { numerator, denominator };
}

console.log(SnowflakeData)
// 初始化 canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let Wh = document.body.clientWidth;;
let Ht = window.innerHeight;
canvas.width = Wh;
canvas.height = Ht;
let quantity = SnowflakeData.Quantity

const Snowflakes = [];
for (let i = 0; i < quantity; i++) {
    Snowflakes.push(GetAF());
}

// 每秒執行 60 次的更新函式
let StepCount = 0
function step() {
    StepCount += 1 / decimalToFraction(SnowflakeData.Speed).denominator
    Wh = document.body.clientWidth;;
    Ht = window.innerHeight;
    canvas.width = Wh;
    canvas.height = Ht;
    for (const snowflake of Snowflakes) {
        snowflake.NextLevel();
        snowflake.draw(ctx);
    }
    window.requestAnimationFrame(step);
    if (StepCount * decimalToFraction(SnowflakeData.Speed).denominator % decimalToFraction(SnowflakeData.Speed).numerator == 0) {
        Snowflakes.push(GetAF())
        Snowflakes.shift()
    }
}
window.requestAnimationFrame(step)

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
});

// canvas.addEventListener("click", () => {
//     opt_D.classList.remove("sting")
// })