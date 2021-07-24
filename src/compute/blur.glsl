#version 300 es
precision mediump float;

#include "kernal.glsl"

uniform sampler2D u_image;

uniform KERNAL u_blur;
uniform float u_weight;

out vec3 color;

void main()
{
    ivec2 i = ivec2(gl_FragCoord.xy);
    DATA data = getData(u_image, i);

    color = convolution(u_blur, u_weight, data);
}
