#version 300 es
precision highp float;

uniform sampler2D data;
out vec4 color;

uint hash(uint state)
{
    state ^= 2747636419u;
    state *= 2654435769u;
    state ^= state >> 16;
    state *= 2654435769u;
    state ^= state >> 16;
    state *= 2654435769u;

    return state;
}

void main()
{
    ivec2 i = ivec2(gl_FragCoord.xy);
    vec4 value = texelFetch(data, i, 0);

    int index = i.y * 720 + i.x;
    float random = float(hash(uint(index))) / 4294967295.0 * 0.2 + 0.8;

    color = value * random;
}
