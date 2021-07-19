#version 300 es
precision highp float;

uniform sampler2D data;
out vec4 color;

void main()
{
    ivec2 i = ivec2(gl_FragCoord.xy);
    vec4 value = texelFetch(data, i, 0);

    // color = vec4(1.0 - value.rgb * 2.0, value.a);
    color = value;
}
