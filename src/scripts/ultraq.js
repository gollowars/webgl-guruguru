window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();


function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    //alert('Query Variable ' + variable + ' not found');
}

export default class UltraQ {
  constructor() {
    
  }

  preload(){
    let d = new $.Deferred
    self = this
    SHADER_LOADER.load(function(data){
        self.vert = data.myShader.vertex
        self.frag = data.myShader.fragment
        d.resolve()
    })
    return d.promise()
  }

  bgLoad(){
    let d = new $.Deferred
    this.bgImage = new Image()
    this.bgImage.src = "./images/bg.jpg";
    this.bgImage.onload = function(){
        d.resolve()
    }
    return d.promise()
  }

  run(){
    this.preload()
    .then(()=>
        this.bgLoad()
        .then(()=>
            this.setup()
        )
    )
  }

  setup(){
    this.wW = $(window).width()
    this.wH = $(window).height()


    let screen_width = this.wW
    let screen_height = this.wH
    if (screen_width >= screen_height) {
        screen_width = screen_height * this.wW / this.wH;
    } else {
        screen_height = screen_width * this.wH / this.wW;
    }

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(90, this.wW / this.wH, 0.1, 1000)
    this.camera.position.z = this.wH/2
    this.renderer = new THREE.WebGLRenderer()

    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize(screen_width, screen_height)
    document.body.appendChild( this.renderer.domElement )


    var imagecanvas = document.createElement('canvas'),
    imagecontext = imagecanvas.getContext('2d');

    imagecanvas.width = this.wW
    imagecanvas.height = this.wH

    //bg
    this.bgImage.width = imagecanvas.width
    this.bgImage.height = imagecanvas.height


    // this.bgImage.width = 0
    // this.bgImage.height = 0

    imagecontext.drawImage(this.bgImage, 0, 0,imagecanvas.width,imagecanvas.height);

    /* define font style */
    // text
    let text = decodeURI(getQueryVariable('text'))
    if(text == 'undefined'){
        text = 'ウルトラQ'
    }

    let textWidth = this.wW*90/100
    let textHeight = textWidth/text.length

    let fontSize = String(Math.floor(textHeight)) + 'px'
    let fontKind = 'YuGothic'
    imagecontext.textAlign = "center"
    imagecontext.font = fontSize + ' ' + fontKind
    imagecontext.fillStyle = "white";

    let textPosX = this.wW/2 
    let textPosY = this.wH/2 

    imagecontext.fillText(text, textPosX, textPosY)

    let imagetexture = new THREE.Texture(imagecanvas)
    imagetexture.needsUpdate = true

    this.time = 1.0
    this.uniforms = {
        texture1: { type: 't', value: imagetexture },
        resolution: {type: "v2", value: new THREE.Vector2( $(window).width()*2, $(window).height()*2 )},
        time:{type: "f", value: 1.0},
        angle:{type: "f", value: 3.0}
    };

    let material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: this.vert,
        fragmentShader: this.frag
    })

    // let material = new THREE.MeshBasicMaterial( {color: 0x990000} )
    let geometory = new THREE.PlaneGeometry( this.wW, this.wH, 1 )
    // let material = new THREE.MeshBasicMaterial( {map: imagetexture} )

    let plane = new THREE.Mesh( geometory, material )
    this.scene.add( plane )

    let duration = 7000
    new TWEEN.Tween(this.uniforms.angle)
    .to({value:0.0},duration)
    .easing( TWEEN.Easing.Quartic.InOut )
    .start()

    this.render()
  }

  render(){
    this.animate()
    requestAnimationFrame( ()=>
      this.render()
    )
  }

  animate(){
    this.renderer.render(this.scene,this.camera)
    this.uniforms.time.value += 1.0*0.01

    TWEEN.update()
  }
}