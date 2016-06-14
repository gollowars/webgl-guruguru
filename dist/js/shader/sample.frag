uniform sampler2D texture1;
uniform vec2 resolution;
uniform float time;
uniform float angle;
varying vec2 vUv;




vec4 postFX(sampler2D tex,vec2 uv,float angle){
  
  float radius = resolution.x;
  vec2 center = vec2(resolution.x/2.0,resolution.y/2.0);
  // float angle = 2.0;

  vec2 texSize = vec2(resolution.x,resolution.y);
  vec2 tc = vUv * texSize;
  tc -= center;
  float dist = length(tc);
  if(dist < radius){
    float percent = (radius-dist)/radius;
    float theta = percent*percent*angle * 8.0;
    float s = sin(theta);
    float c = cos(theta);
    tc = vec2(dot(tc,vec2(c,-s)),dot(tc,vec2(s,c)));
  }
  tc += center;

  vec3 color = texture2D(tex, tc / texSize).rgb;

  return vec4(color, 1.0);
}

void main() {

    // float angle = 2.0;
    vec4 dist = postFX(texture1,vUv,angle);
    gl_FragColor = dist;
    // gl_FragColor = vec4(0.5, 0.2, 1.0, 1.0); // Works; Displays Flat Color
}