export class Display {
    /**
     * 
    */
    constructor() {
        this.canvas = document.querySelector('#myCanvas');
        this.ctx = this.canvas.getContext('2d');
    }
    /**
     * use to set the 
     * width => of the window.
     * height => of the window.
     * parameter => tuples[int,int]
     * width => int
     * height => int 
     * 
         */
        set_mode(coord) {
            let [x, y] = coord;
            this.canvas.width = x;
            this.canvas.height = y;
            return this
        }
    /**
     * use to fill color to the screen.
         * parameter => tuples[int,int,int]
         * red => int range(0,255)
         * green => int range(0,255)
         * blue => int range(0,255)
    */
   fill(color) {
       let [r, g, b] = color;
       this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
       this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    blit(img) {
        // console.log(img.x);
        this.ctx.drawImage(img.image, img.x, img.y);
        
    }
    
}
/**
 * 
*/

export class Rect {
    /**
     * name => Rect
    */
   constructor(x, y, w, h) {
       this.x = x;
       this.y = y;
       this.w = w;
       this.h = h;
       this.topleft = [this.x,this.y];
       this.topright = [this.x+this.w,this.y];
       this.bottomleft = [this.x,this.y+this.w];
       this.bottomright = [this.x+this.w,this.y+this.w];
       this.size = [this.w,this.h];
    }
    /**
     * 
     */
    istype() {
        return 'pyobject'
    }
    /**
     * use to find collision detection between two rectangles
     * parameters => Rect()<object>
     */
    colliderect(rect) {
        if (rect.x + rect.w > this.x && rect.x < this.x + this.w && rect.y + rect.h > this.y && rect.y < this.y + this.h) {
            return true;
        } else {
            return false;
        }
    }
    collidepoint(point) {
        if (this.x < point[0] && point[0] < this.x + this.w && this.y < point[1] && point[1] < this.y + this.h) {
            return true;
        } else {
            return false;
        }
    }

}
// export class this.image extends Image {
//     constructor(){
//         super();
//         this.x = 0;
//         this.y = 0;
//     }
//     get_rect(){
//         return Rect(this.x,this.y,this.width,this.height);
//     }

// }
export class image {
    constructor(src) {
    this.Canvas = document.createElement('canvas');
    this.image = new Image();
    this.image.src = src;
    this.x = 0;
    this.y = 0;

    this.loaded = new Promise((resolve) => {
      this.image.onload = () => resolve(this);
    });
  }
  get_rect(){
    return Rect(this.x,this.y,this.image.width,this.image.height)
  }
    get_follow(rect){
        this.x = rect.x;
        this.y = rect.y;
    }
    
    async applytransformation(fnc) {
        let size = Math.max(this.image.width, this.image.height) + this.image.height;
        this.Canvas.width = size;
        this.Canvas.height = size;
        this.Ctx = this.Canvas.getContext('2d');
        this.Ctx.clearRect(0, 0, size, size);

        this.Ctx.save();
        // this.Ctx.translate(size / 2, size / 2);
        fnc(this.Ctx);
        this.Ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
        this.Ctx.restore();
        
        // return await this.load(this.Canvas.toDataURL());
        return new image(this.Canvas.toDataURL());
        
    }

    async rotate(angle) {
        // not use this function under working....
        const anglerad = angle * (Math.PI / 180);
        let size = Math.max(this.image.width, this.image.height) + this.image.height;
        return await this.applytransformation( (ctx) => {
            ctx.rotate(anglerad);
        
            ctx.translate(size / 2, size / 2);
            
        });
    }
    
    //     /** GUIDE 
    //      * Scale Value	     What It Does	                     Example Output Size (for 100×100 image)
    //      * scale(1, 1)	    =>  No scaling (original size)	  =>         100×100
    //      * scale(0.5, 0.5)	=>  Shrinks to 50%	              =>         50×50
    //      * scale(2, 2)	    => Doubles the size	              =>     200×200
    //      * scale(1.5, 1.5)	=> Increases by 50%	              =>     150×150
    //      * scale(-1, 1)	    => Flips horizontally	          =>         Mirrored image
    //      * scale(1, -1)	    => Flips vertically	              =>     Upside-down image
    //      * scale(0.75, 2)	=> Squish width, stretch height	  =>     75×200
    //      * scale(2, 0.5)	=> Stretch width, shrink height	  =>     200×50
    //     */
    scaleintopx(value){
        return [value[0]/this.image.width, value[1]/this.image.height]

    }
    async scale(s) {
        s = this.scaleintopx(s)
        return await this.applytransformation((ctx) => {
            ctx.scale(s[0], s[1]);
            ctx.translate(s[0] / 2, s[1] / 2);
            
        });
    }
    
    // load(src) {
    //     // return new Promise ((resolve)=>{
    //     //     const New_image = new this.image();
    //     //     New_image.onload = () => resolve(New_image);
    //     //     New_image.src = src;
    //     // });
    //     return 
    // }
}
export class Draw {
    /**
     * 
     */
    constructor() {
        this.obj = null;
    }
    /**
     * 
     */
    rect(screen, color, rect) {
        let [r, g, b] = color;
        let ispyobject = false
        try {
            if (rect.istype() == 'pyobject') {
                ispyobject = true
            }

        } catch (error) {
            console.log('not pyobject')
        }
        if (ispyobject) {
            this.obj = [rect.x, rect.y, rect.w, rect.h];

        } else {
            this.obj = rect;

        }
        let [x, y, w, h] = this.obj;
        screen.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        screen.ctx.fillRect(x, y, w, h);

    }
    outlinerect(screen, color, rect,width) {
        let [r, g, b] = color;
        let ispyobject = false
        try {
            if (rect.istype() == 'pyobject') {
                ispyobject = true
            }

        } catch (error) {
            console.log('not pyobject')
        }
        if (ispyobject) {
            this.obj = [rect.x, rect.y, rect.w, rect.h];

        } else {
            this.obj = rect;

        }
        let [x, y, w, h] = this.obj;
        screen.ctx.strokeStyle  = `rgb(${r}, ${g}, ${b})`;
        screen.ctx.lineWidth = width;

        screen.ctx.strokeRect(x, y, w, h);

    }
    line(screen, color, start, end, thickness) {
        screen.ctx.beginPath();
        screen.ctx.moveTo(start[0], start[1]);   // Starting point (x, y)
        screen.ctx.lineTo(end[0], end[1]); // Ending point (x, y)
        screen.ctx.strokeStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
        screen.ctx.lineWidth = thickness;
        screen.ctx.stroke();
    }
}
/**
     * 
     */
export class event {
    /**
     * 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.canvasrect = this.canvas.getBoundingClientRect()
        this.keypressed = {};
        this.keydown = {};
        this.coord = null;
        this.mousepressed = 0;
        this.mouseclick = 0;

    }
    /**
     * 
     */
    init() {
        this.key_pressed();
        this.key_down();
        this.set_pos();
        this.mouse_pressed();
        this.mouse_down();
    }
    /**
     * 
     */
    set_pos() {
        this.canvas.addEventListener("mousemove", (e) => {
            this.coord = [e.clientX - this.canvasrect.left, e.clientY - this.canvasrect.top];
        });
    }
    /**
     * 
     */
    get_pos() {
        if (this.coord == null) {
            return [0, 0];
        }
        return this.coord;
    }
    /**
     * 
     */
    mouse_pressed() {
        document.addEventListener("mousedown", (e) => {
            this.mousepressed = e.buttons;
        })
        document.addEventListener("mouseup", (e) => {
            this.mousepressed = e.buttons;
        })
    }
    /**
     * 
     */
    mouse_down() {
        document.addEventListener("mousedown", (e) => {
            if (!e.repeat) {
                this.mouseclick = [e.buttons, 0];
            }
        })
    }
    /**
     * 
     */
    Mclick() {
        if (this.mouseclick[0] && this.mouseclick[1] == 0) {
            this.mouseclick[1] = 1;
            return this.mouseclick[0];
        }
        else {
            return 0
        }
    }
    /**
     * 
     */
    Mpressed() {
        return this.mousepressed;
    }
    /**
     * 
     */
    key_pressed() {
        document.addEventListener("keydown", (event) => {
            this.keypressed[event.key] = true;
        });
        document.addEventListener("keyup", (event) => {
            this.keypressed[event.key] = false;
        });
    }
    /**
     * 
     */
    key_down() {
        document.addEventListener("keydown", (event) => {
            if (!event.repeat) {
                this.keydown[event.key] = [true, 0];

            }
        });

    }
    /**
     * use for debuging
     */
    show_keys() {
        document.addEventListener("keydown", (event) => {
            console.log(event.key);
        });
    }
    /**
     * 
     */
    Kclick(key) {
        try {
            if (this.keydown[key][0] && this.keydown[key][1] == 0) {
                this.keydown[key][1] = 1;
                return this.keydown[key][0];
            }

        } catch (error) {
            return false;
        }
    }
    /**
     * 
     */
    Kpressed(key) {
        try {
            if (this.keypressed[key]) {
                return this.keypressed[key];
            }

        } catch (error) {
            return false;
        }
    }



}
/**
     * 
     */
export class Random {
    /**
     * 
     */
    randint(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * 
     */
    randint_gap(min, max, gap) {
        let r = this.randint(min, max)
        return Math.floor(r / gap) * gap;
    }

}
/**
     * 
     */
export class Font {
    constructor(screen,font,size){
        this.font = font;
        this.fontsize = size;
        this.screen = screen;
    }
    fillrender(text,color,position){
        let [r,g,b] = color;
  this.screen.ctx.font = `${this.fontsize}px ${this.font}`;
  this.screen.ctx.fillStyle = `rgb(${r},${g},${b})`;
  this.screen.ctx.textBaseline = "top";  
  this.screen.ctx.fillText(text, position[0], position[1]);

    }
    outlinerender(text,color,position,width){
        let [r,g,b] = color;
  this.screen.ctx.font = `${this.fontsize}px ${this.font}`;
  this.screen.ctx.strokeStyle  = `rgb(${r},${g},${b})`;  
  this.screen.ctx.lineWidth = width;
  this.screen.ctx.textBaseline = "top";
  this.screen.ctx.strokeText(text, position[0], position[1]);

    }
}
export class Pygame {
    /**
     * 
     */
    constructor() {
        this.isrunning = true;
        this.display = new Display();
        this.draw = new Draw();
        this.event = new event(this.display.canvas);
        this.random = new Random();
        this.Rect = Rect;
        this.image = image;
        this.font = Font;
        this.fps = 0;
        this.canvas_help = '<canvas id="myCanvas" style="border: 2px solid #555"></canvas>';
    }
    /**
     * 
     */
    gameover() {
        this.isrunning = false;
    }
    /**
     * 
     */
    gameover_event(event) {
        setTimeout(() => {
            if (this.isrunning) {
                requestAnimationFrame(this.gameloop);
            } else {
                event();
            }
        }, this.fps);
    }
    /**
     * 
     */
    set_fps(value) {
        this.fps = 1000 / value;
    }
    /**
     * 
     */
    gameloop() {
        /**
             not write there it is for overriding gameloop!
             */
    }

}