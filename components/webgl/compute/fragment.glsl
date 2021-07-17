#version 300 es
precision highp float;

uniform sampler2D data;
out vec4 outColor;

void main()
{
    ivec2 i = ivec2(gl_FragCoord.xy);
    vec4 value = texelFetch(data, i, 0);

    outColor = value * 2.0;
}
