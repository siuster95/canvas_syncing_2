//variables 
let canvas;

let ctx;

let mouseX;

let mouseY;

let markerpositionx;
let markerpositiony;

let roomNumber;

let socket;

let circleobjs = [];

let positions = [];

let R;
let G;
let B;

const user = Math.floor(Math.random() * 1000);

//functions
const markerposition = (X,Y) => {
    //first row
    if(Y < 100){
     if(X < 100)
     {
         markerpositionx = 50;
         markerpositiony = 50;
     }
     else if(X < 200)
     {
         markerpositionx = 150;
         markerpositiony = 50;
     }
     else if(X < 300)
     {
         markerpositionx = 250;
         markerpositiony = 50;
     }
     else if(X < 400)
     {
         markerpositionx = 350;
         markerpositiony = 50;
     }
     else if(X < 500)
     {
         markerpositionx = 450;
         markerpositiony = 50;
     }
    }
    //second row
    else if(Y< 200)
    {
        if(X < 100)
     {
         markerpositionx = 50;
         markerpositiony = 150;
     }
     else if(X < 200)
     {
         markerpositionx = 150;
         markerpositiony = 150;
     }
     else if(X < 300)
     {
         markerpositionx = 250;
         markerpositiony = 150;
     }
     else if(X < 400)
     {
         markerpositionx = 350;
         markerpositiony = 150;
     }
     else if(X < 500)
     {
         markerpositionx = 450;
         markerpositiony = 150;
     }
    }
    //third row
    else if(Y< 300)
    {
        if(X < 100)
     {
         markerpositionx = 50;
         markerpositiony = 250;
     }
     else if(X < 200)
     {
         markerpositionx = 150;
         markerpositiony = 250;
     }
     else if(X < 300)
     {
         markerpositionx = 250;
         markerpositiony = 250;
     }
     else if(X < 400)
     {
         markerpositionx = 350;
         markerpositiony = 250;
     }
     else if(X < 500)
     {
         markerpositionx = 450;
         markerpositiony = 250;
     }
    }
        //forth row
    else if(Y< 400)
    {
        if(X < 100)
     {
         markerpositionx = 50;
         markerpositiony = 350;
     }
     else if(X < 200)
     {
         markerpositionx = 150;
         markerpositiony = 350;
     }
     else if(X < 300)
     {
         markerpositionx = 250;
         markerpositiony = 350;
     }
     else if(X < 400)
     {
         markerpositionx = 350;
         markerpositiony = 350;
     }
     else if(X < 500)
     {
         markerpositionx = 450;
         markerpositiony = 350;
     }
    }
    //fifth row
    else if(Y< 500)
    {
        if(X < 100)
     {
         markerpositionx = 50;
         markerpositiony = 450;
     }
     else if(X < 200)
     {
         markerpositionx = 150;
         markerpositiony = 450;
     }
     else if(X < 300)
     {
         markerpositionx = 250;
         markerpositiony = 450;
     }
     else if(X < 400)
     {
         markerpositionx = 350;
         markerpositiony = 450;
     }
     else if(X < 500)
     {
         markerpositionx = 450;
         markerpositiony = 450;
     }
    }
};

const drawPredict = () => {
    
    redraw();
    
    for(let x =0;x < positions.length;x++)
    {
        if(markerpositionx == positions[x].x && markerpositiony == positions[x].y)
        {
            return;
        }

    }
    ctx.save();
    ctx.strokeStyle = `rgb(${R},${G},${B})`;
    ctx.globalAlpha=0.5;
    ctx.beginPath();
    console.log(markerpositionx);
    console.log(markerpositiony);
    ctx.arc(markerpositionx,markerpositiony,50,0,2*Math.PI*2);
    ctx.stroke();
    ctx.restore();
    
};

const init = () => {
    
    socket = io.connect();
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext("2d");
    
   
    for(let y = 0; y < 5; y++)
        {
            circleobjs[y] = [];
        }
    for(let x =0;x<5;x++)
    {
        for(let k =0;k<5;k++)
        {
            circleobjs[x][k] = null;
        }
    }
    

    canvas.addEventListener('mousemove',(evt)=>{
        let object = getmousemove(canvas,evt);
        mouseX = object.x;
        mouseY = object.y;
        markerposition(mouseX,mouseY);
        drawPredict();
    });
    
    canvas.addEventListener('click', drawCircle);
    
    socket.on('UpdatefromServer',(data) => {
        let x = (data.circle.x - 50) / 100;
        let y = (data.circle.y - 50) / 100;

        if( x < 0)
        {
            x = 0;
        }
        if( y < 0)
        {
            y = 0;
        }

        if(circleobjs[x][y] == null)
        {
            circleobjs[x][y] = data;
        }
        
        redraw();
    });
    socket.on("Joined",(data)=>{

        R = data.R;
        G = data.G;
        B = data.B;
        circleobjs = data.circleobjs;
        roomNumber = data.Roomnumber;
        redraw();
    });
};

 //get mouse movement 
        const getmousemove = (canvas,evt) => {
           let rect = canvas.getBoundingClientRect();
            return{
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top
            };
        };

  //click and make a circle
        const drawCircle = () => {
            for(let i =0; i< positions.length;i++)
            {
              let xpos = positions[i].x;   
              let ypos = positions[i].y
              
              if(markerpositionx == xpos && markerpositiony == ypos)
                {
                    return;
                }
            }
            let date = new Date().getTime();
            let circle = {
              x:markerpositionx,
              y:markerpositiony,
              radius:50,
              R:R,
              G:G,
              B:B
            };
            socket.emit('updateCanvas',{circle:circle,roomNumber:roomNumber});
            console.log('sending circle to server');
        };

        const redraw = () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            positions = [];
            for(let x =0; x < 5; x++)
            {
            for(let y =0;y<5;y++)
            {
                let object  = circleobjs[x][y];
                if(object != null)
                {
                ctx.save();
                console.log(object.circle.x);
                console.log(object.circle.y);
               
                ctx.strokeStyle = `rgb(${object.circle.R},${object.circle.G},${object.circle.B})`;
                ctx.fillStyle = `rgb(${object.circle.R},${object.circle.G},${object.circle.B})`;

                 ctx.beginPath();
                 ctx.arc(object.circle.x,object.circle.y,50,0,2*Math.PI*2);
                 ctx.fill();
                 ctx.stroke();
                ctx.restore();
                
                let newposition = {x:object.circle.x,y:object.circle.y};
                positions.push(newposition);
                }
            }
            
        }};


window.onload = init;
