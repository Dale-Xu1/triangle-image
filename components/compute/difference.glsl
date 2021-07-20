#version 300 es
precision lowp float;

uniform sampler2D data;
uniform sampler2D target;

out float color;

void main()
{
    ivec2 i = ivec2(gl_FragCoord.xy);
    vec4 value = texelFetch(data, i, 0);

    // Remove alpha channel assuming white background
    vec3 a = value.rgb + (1.0 - value.a);
    vec3 b = texelFetch(target, i, 0).rgb;

    vec3 c = a - b;
    c = c * c;

    // Average color channels
    color = (c.r + c.g + c.b) / 3.0;
}
