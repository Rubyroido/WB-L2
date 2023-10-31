const canvas = document.querySelector('.canvas');
const context = canvas.getContext("2d");

const imgInput = document.querySelector('.add-picture');
const textForm = document.querySelector('.form-text');
const resetButton = document.querySelector('.button-clear');
const downloadButton = document.querySelector('.button-save');

const texts = [];
let image;
let lastX = 0;
let lastY = 0;
let mouseIsDown = false;
const canvasOffset = canvas.getBoundingClientRect();
const offsetX = canvasOffset.left;
const offsetY = canvasOffset.top;

imgInput.addEventListener('change', (e) => {
    let imageFile = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = (e) => {
        image = new Image();
        image.src = e.target.result;
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
        }
    }
})

textForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = textForm.querySelector('.add-text');
    const colorSelect = textForm.querySelector('.color-select');
    const fontSelect = textForm.querySelector('.font-select');
    const text = input.value;
    const color = colorSelect.value;
    const font = fontSelect.value;
    drawText(text, color, font);
    input.value = '';
})

function drawText(text, color, font) {
    const startingX = canvas.width / 2;
    const startingY = canvas.height / 2;

    context.fillStyle = `${color}`;
    context.font = `${canvas.height * 0.1}px ${font}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, startingX, startingY, (canvas.width * 0.7));

    const textWidth = context.measureText(text).width;
    const textHeight = canvas.height * 0.1;

    texts.push({
        text: text,
        x: startingX,
        y: startingY,
        width: textWidth,
        height: textHeight,
        color: color,
        font: font
    });
    console.log(texts)
}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        redrawText(text);
    }
}

function redrawText(data) {
    context.fillStyle = `${data.color}`;
    context.font = `${canvas.height * 0.1}px ${data.font}`;
    context.fillText(data.text, data.x, data.y)
}

function handleMouseDown(e) {
    mouseX = parseInt((e.clientX - offsetX) * (canvas.width / canvas.clientWidth));
    mouseY = parseInt((e.clientY - offsetY) * (canvas.height / canvas.clientHeight));

    lastX = mouseX;
    lastY = mouseY;
    mouseIsDown = true;
}

function handleMouseUp(e) {
    mouseX = parseInt((e.clientX - offsetX) * (canvas.width / canvas.clientWidth));
    mouseY = parseInt((e.clientY - offsetY) * (canvas.height / canvas.clientHeight));

    mouseIsDown = false;
}

function handleMouseMove(e) {
    if (!mouseIsDown) {
        return;
    }
    mouseX = parseInt((e.clientX - offsetX) * (canvas.width / canvas.clientWidth));
    mouseY = parseInt((e.clientY - offsetY) * (canvas.height / canvas.clientHeight));
    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        redrawText(text);
        context.beginPath();
        const x = text.x - text.width/2;
        const y = text.y - text.height/2;
        context.rect(x, y, text.width, text.height);
        if (context.isPointInPath(mouseX, mouseY)) {
            text.x += (mouseX - lastX);
            text.y += (mouseY - lastY);
        }
        context.closePath();
    }
    lastX = mouseX;
    lastY = mouseY;
    redraw();
}

canvas.addEventListener('mousedown', (e) => {
    handleMouseDown(e)
})
canvas.addEventListener('mousemove', (e) => {
    handleMouseMove(e)
})
canvas.addEventListener('mouseup', (e) => {
    handleMouseUp(e)
})

resetButton.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    imgInput.value = '';
    texts = [];
})

downloadButton.addEventListener('click', () => {
    let canvasUrl = canvas.toDataURL();
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = "meme";
    createEl.click();
    createEl.remove();
})