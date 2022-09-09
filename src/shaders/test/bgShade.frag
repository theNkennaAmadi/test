#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable



uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float rand (float x) {
    return fract(sin(x * 2.63) * 3.3);
}

//____________________________________________
float random(vec2 pos) {
    return fract(cos(dot(pos.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 pos) {
    vec2 i = floor(pos);
    vec2 f = fract(pos);
    float a = random(i + vec2(0.0, 0.0));
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 pos) {
    float v = 0.3;
    float a = 0.64;
    v += a * noise(pos);
    return v;
}
//______________________________________________
float snow(vec2 uv,float scale)
{


    float w = smoothstep(1.,0., -uv.y *(scale * 0.25));

    if(w < .1)return -0.;

    uv += u_time / scale / 02.34;
    uv.y += u_time * 0./ scale;
    uv.x += sin (uv.y + u_time*.5) / scale;
    uv *= scale / 4.34;
    vec2 s = floor(uv), f = fract(uv), p;
    float k = 3., d;
    p = 0.1 + .55 * sin(11.*fract(sin((s+p+scale) * mat2(7,3,6,5))*5.)) - f;
    d = length(p);
    k = min(d,k);
    k = smoothstep(0., k, sin(f.x+f.y) * 0.01);
    return k*w*.4;
}

void main(void) {
    vec2 uv = (gl_FragCoord.xy * 4. - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec3 finalColor = vec3(0);
    float c = 0.64;
    c += snow(uv, 9.5);
    c += snow(uv, 68.0);
    c -= snow(uv, 62.5);
    c -= snow(uv, 64.288);
    finalColor = (vec3(c));
    //_________________________________
    vec2 p = (gl_FragCoord.xy * 3.9 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    float t = 0.0, d;

    float time2 = 3.0 * u_time * 2.50;

    vec2 q = vec2(0.0);
    q.x = fbm(p + 0.025 * time2);
    q.y = fbm(p + vec2(1.0));
    vec2 r = vec2(0.0);
    r.x = fbm(p + -8.0 * q + vec2(.27, .2) + 0.0025 * time2);
    r.y = fbm(p + 2.0 * q + vec2(.3, 2.8) + 0.126 * time2);
    float f = fbm(p + r);
    vec3 color = mix(
        vec3(1.2101961, 0.26667, 0.419608),
        vec3(3.3667, 0.18039, 2.16667),
        clamp((f * f) * 5.624, 0.0, 1.0)
    );


    color = mix(
        color,
        vec3(.09803921, .6666666666, 1.954902),
        clamp(length(q), 0.0, 1.0)
    );
}
