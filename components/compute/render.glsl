#version 300 es
precision mediump float;

uniform sampler2D u_render;
out vec4 color;

void main()
{
    ivec2 i = ivec2(gl_FragCoord.xy);
    color = texelFetch(u_render, i, 0);
}
