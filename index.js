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

          this.canvas.width = 800; // ta set width va height truc tiep de dung voi kich thuoc that cua no, ko set tai css
          this.canvas.height = 678;

          this.color = color;
          this.tool = tool;
          this.lineWidth = lineWidth;
          this.currentPos = {
            x: 0,
            y: 0,
          };
          this.isDrawing = false;

          this.image = null;
          this.arrImg = [];
          this.drawBackground();
          // tao ham lang nghe su kien
          this.listenEvents(); // khai bao de chay ham nay ngay trong Object
          this.drawLine(10, 19, 100, 100);
        }
        // lay gia tri x y
        getMousePos(evt) {
          var rect = this.canvas.getBoundingClientRect();
          return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
        }

        // goi hma mousedown
        mousedown(e) {
          let mousePos = this.getMousePos(e);
          this.isDrawing = true;

          this.image = new Image();
          this.image.src = this.canvas.toDataURL('image/jpeg', 1.0);
          this.arrImg.push(this.image.src);
        }
        mousemove(e) {
          let mousePos = this.getMousePos(e);
          if (this.isDrawing) {
            switch (this.tool) {
              case 'Pen':
                this.drawLine(this.currentPos, mousePos);
                break;
              case 'Line':
                // this.drawLineStraight(this.currentPos, mousePos);
                break;
            }
          }

          this.currentPos = mousePos;
        }
        mouseup(e) {
          this.isDrawing = false;

          // document.body.appendChild(this.image);
        }
        //lang nghe su kien
        listenEvents() {
          this.canvas.addEventListener('mousedown', (e) => this.mousedown(e)); //goi ham mousedown
          this.canvas.addEventListener('mousemove', (e) => this.mousemove(e));
          this.canvas.addEventListener('mouseup', (e) => this.mouseup(e));
        }
        // thiet ke backgrourd cho canvas images
        drawBackground() {
          this.ctx.fillStyle = '#FFFFFF';
          this.ctx.fillRect(0, 0, 800, 678);
        }
        undoClick() {
          console.log(this.image);

          this.ctx.drawImage(this.image, 0, 0, 800, 678);
        }
        // tham chieu vi tri cua con tro chuot khi onmouse canvas
        drawLine(startPos, endPos) {
          this.ctx.lineWidth = this.lineWidth;
          this.ctx.strokeStyle = this.color;
          this.ctx.beginPath();
          this.ctx.moveTo(startPos.x, startPos.y);
          this.ctx.lineTo(endPos.x, endPos.y);
          this.ctx.stroke();
        }
      }

      // truyen ma mau khi click vao color
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
      // xay dung cong cu ve
      function tooltipClick() {
        iconLine.onclick = function () {
          setTooltip('Line');
        };
        iconSetSize.onclick = function () {
          setTooltip('Pen');
        };
      }
      undoIcon.onclick = function () {
        paint.undoClick();
      };
      // function undoClick() {}
      function setTooltip(nameTool) {
        paint.tool = nameTool;
      }
      let paint = new Paint();
      console.log(paint.tool);

      tooltipClick();
      onShowTableSetSize();
      setBackgroundColorToSpan(color);
    };
  },
  false
);
