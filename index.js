document.addEventListener(
    'DOMContentLoaded',
    () => {
        window.onload = function () {
            const $$ = document.querySelectorAll.bind(document);
            const $ = document.querySelector.bind(document);

            const colorEle = $$('.color');
            const sizePen = $$('.size');
            const iconSetSize = $('.pencil');
            const iconLine = $('.slash');
            const tableSize = $('.table-size');
            const undoIcon = $('.undo');
            const redoIcon = $('.redo');
            const circleIcon = $('.circle');
            const square = $('.square');
            const prescriptionIcon = $('.prescription');
            const showhideModal = $$('a');
            const blur = document.getElementById('blur');
            const popup = document.getElementById('popup');
            const canvasImg = document.querySelector('#canvas-img');
            const canvas = document.getElementById('canvas');
            const imageEle = $$('.image');
            const undoAlt = $('.undo-alt');

            const color = [
                'rgb(255, 5, 5)',
                'rgb(0, 0, 0)',
                'rgb(0, 255, 0)',
                'rgb(0, 42, 255)',
                'rgb(123, 0, 255)',
                'rgb(255, 0, 230)',
                'rgb(0, 255, 238)',
                'rgb(255, 0, 128)',
                'rgb(242, 255, 0)',
                'rgb(255, 166, 0)',
                'rgb(81, 0, 255)',
                'rgb(0, 106, 255)',
            ];
            // set background color cho span trong menu-bottom
            function setBackgroundColorToSpan(color) {
                for (let i = 0; i < color.length; i++) {
                    colorEle[i].style.backgroundColor = color[i];
                    handleColorClick(i, color[i]);
                }
            }

            class Paint {
                constructor(color, tool = 'Pen', lineWidth) {
                    this.canvas = $('#canvas');
                    this.ctx = this.canvas.getContext('2d');

                    this.canvas.width = 740; // ta set width va height truc tiep de dung voi kich thuoc that cua no, ko set tai css
                    this.canvas.height = 602;

                    this.color = color;
                    this.tool = tool;
                    this.lineWidth = lineWidth;
                    this.currentPos = {
                        x: 0,
                        y: 0,
                    };

                    this.startPos = {
                        x: 0,
                        y: 0,
                    };
                    this.isDrawing = false;
                    this.oldImage = null;
                    this.newImage = null;
                    this.cleanImage = null;
                    this.arrImg = [];
                    this.drawBackground();

                    this.listenEvents(); // khai bao de chay ham nay ngay trong Object
                    this.drawLine(10, 19, 100, 100);
                    this.prescriptionClick();
                }
                getMousePos(evt) {
                    var rect = this.canvas.getBoundingClientRect();
                    return {
                        x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top,
                    };
                }

                mousedown(e) {
                    let mousePos = this.getMousePos(e);
                    this.startPos = this.getMousePos(e);
                    this.isDrawing = true;

                    this.saveState();
                }
                mousemove(e) {
                    let mousePos = this.getMousePos(e);

                    if (this.isDrawing) {
                        switch (this.tool) {
                            case 'Pen':
                                this.drawLine(this.currentPos, mousePos);
                                break;
                            case 'Line':
                                this.undoClick();
                                this.drawLine(this.startPos, mousePos);
                                break;
                            case 'Rect':
                                this.undoClick();
                                this.drawRect(this.startPos, mousePos);
                                break;
                            case 'Cricle':
                                this.undoClick();
                                this.drawCricle(this.startPos, mousePos);
                        }
                    }

                    this.currentPos = mousePos;
                }
                mouseup(e) {
                    this.isDrawing = false;
                }
                listenEvents() {
                    this.canvas.addEventListener('mousedown', (e) =>
                        this.mousedown(e),
                    ); //goi ham mousedown
                    this.canvas.addEventListener('mousemove', (e) =>
                        this.mousemove(e),
                    );
                    this.canvas.addEventListener('mouseup', (e) =>
                        this.mouseup(e),
                    );
                }
                drawBackground(img = '#fff') {
                    console.log(img);
                    this.ctx.fillStyle = '#fff';
                    this.ctx.fillRect(
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height,
                    );
                    this.saveState();
                }
                saveState() {
                    this.oldImage = new Image();
                    this.oldImage.src = this.canvas.toDataURL(
                        'image/jpeg',
                        1.0,
                    );
                }
                undoClick() {
                    if (!this.isDrawing) {
                        this.newImage = new Image();
                        this.newImage.src = this.canvas.toDataURL(
                            'image/jpeg',
                            1.0,
                        );
                    }

                    this.ctx.drawImage(
                        this.oldImage,
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height,
                    );
                }
                redoClick() {
                    this.ctx.drawImage(
                        this.newImage,
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height,
                    );
                }
                prescriptionClick() {
                    this.ctx.clearRect(
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height,
                    );
                    this.drawBackground();
                }

                drawCricle(startPos, endPos, x, y) {
                    this.ctx.lineWidth = this.lineWidth;
                    this.ctx.strokeStyle = this.color;
                    let rect = endPos.x - startPos.x;
                    if (rect < 0) {
                        rect = startPos.x - endPos.x;
                    }
                    if (rect > 0) {
                        this.ctx.save();
                        this.ctx.beginPath(); //x y
                        this.handleScale(x, y);
                        // this.ctx.translate(
                        //     endPos.x - startPos.x,
                        //     endPos.y - startPos.y,
                        // );
                        // this.ctx.scale(endPos.x, endPos.y);
                        this.ctx.arc(
                            startPos.x,
                            startPos.y,
                            rect,
                            0,
                            rect * Math.PI,
                        );
                        this.ctx.stroke();
                        this.ctx.restore();
                    }
                }
                keyCode(event) {
                    if (event.which == 88 || event.keyCode == 88) {
                        this.handleScale(0.75, 1);
                    }
                }
                handleScale(x, y) {
                    return this.ctx.scale(x, y);
                }
                drawRect(startPos, endPos) {
                    this.ctx.lineWidth = this.lineWidth;
                    this.ctx.strokeStyle = this.color;
                    this.ctx.beginPath();
                    this.ctx.rect(
                        startPos.x,
                        startPos.y,

                        endPos.x - startPos.x,
                        endPos.y - startPos.y,
                    );
                    this.ctx.stroke();
                }
                drawLine(startPos, endPos) {
                    this.ctx.lineWidth = this.lineWidth;
                    this.ctx.strokeStyle = this.color;
                    this.ctx.beginPath();
                    this.ctx.moveTo(startPos.x, startPos.y);
                    this.ctx.lineTo(endPos.x, endPos.y);
                    this.ctx.stroke();
                }
            }
            function handleColorClick(i, col) {
                colorEle[i].onclick = function () {
                    console.log(col);
                    paint.color = col;
                };
            }
            function handleSetSizeClick() {
                for (let i = 0; i < sizePen.length; i++) {
                    sizePen[i].onclick = function () {
                        console.log(i);
                        paint.lineWidth = i + 1;
                    };
                }
            }
            function onShowTableSetSize() {
                iconSetSize.ondblclick = function () {
                    tableSize.style.display = 'block';
                    handleSetSizeClick();
                };
            }
            function tooltipClick() {
                iconLine.onclick = function () {
                    setTooltip('Line');
                    canvas.style.cursor = 'default';
                };
                iconSetSize.onclick = function () {
                    setTooltip('Pen');
                    canvas.style.cursor = 'default';
                };
                square.onclick = function () {
                    setTooltip('Rect');
                    canvas.style.cursor = 'crosshair';
                };
                circleIcon.onclick = function () {
                    setTooltip('Cricle');
                    canvas.style.cursor = 'crosshair';
                };
            }
            undoIcon.onclick = function () {
                paint.undoClick();
            };
            redoIcon.onclick = function () {
                paint.redoClick();
            };
            prescriptionIcon.onclick = function () {
                paint.prescriptionClick();
            };
            function undoBackgroundImageCanvas(imgUrl) {
                undoAlt.onmousedown = function () {
                    canvasImg.setAttribute('src', '');
                };
                undoAlt.onmouseup = function () {
                    canvasImg.setAttribute('src', imgUrl);
                };
            }
            document.onkeyup = function (e) {
                paint.keyCode(e);
            };
            function toggle() {
                for (let i = 0; i < showhideModal.length; i++) {
                    showhideModal[i].onclick = function () {
                        blur.classList.toggle('active');
                        popup.classList.toggle('active');
                    };
                }
            }
            function onloadModal() {
                blur.classList.toggle('active');
                popup.classList.toggle('active');
            }
            function setTooltip(nameTool) {
                paint.tool = nameTool;
            }
            function handleImageOnCanvas() {
                for (let i = 0; i < imageEle.length; i++) {
                    imageEle[i].onclick = function () {
                        const bakColor = 'rgb(255, 255, 255, 0.5)';
                        const imgUrl = imageEle[i].getAttribute('data-url');
                        blur.classList.toggle('active');
                        popup.classList.toggle('active');
                        paint.drawBackground(bakColor); // cấn chỗ ni nè
                        canvasImg.setAttribute('src', imgUrl);
                        undoBackgroundImageCanvas(imgUrl);
                    };
                }
            }
            let paint = new Paint();
            handleImageOnCanvas();
            onloadModal();
            toggle();
            tooltipClick();
            onShowTableSetSize();
            setBackgroundColorToSpan(color);
        };
    },
    false,
);
