#version 300 es
precision mediump float;

#include "kernal.glsl"
#define EDGE_FACTOR 0.15

uniform sampler2D u_data;
uniform sampler2D u_target;

uniform KERNAL u_sobelX;
uniform KERNAL u_sobelY;

out float color;

vec3 sobel(DATA data)
{
    vec3 x = convolution(u_sobelX, data);
    vec3 y = convolution(u_sobelY, data);

    // Magnitude of derivative in the x and y directions
    return sqrt(x * x + y * y);
}

void main()
{
    ivec2 i = ivec2(gl_FragCoord.xy);

    DATA data = getData(u_data, i);
    DATA target = getData(u_target, i);

    vec3 a = data[4]; // Index 4 is the middle pixel
    vec3 b = target[4];

    vec3 d = sobel(data);
    vec3 t = sobel(target);

    // Calculate difference in colors and edges
    vec3 c = a - b;
    vec3 s = (d - t) * EDGE_FACTOR;

    // Average color channels
    vec3 diff = c * c + s * s;
    color = diff.r + diff.g + diff.b;
}
