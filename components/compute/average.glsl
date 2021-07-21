#version 300 es
precision mediump float;

uniform sampler2D difference;
uniform int width;

out float color;

void main()
{
    float sum = 0.0;
    for (int i = 0; i < width; i++)
    {
        // Sum values
        vec4 value = texelFetch(difference, ivec2(i, 0), 0);
        sum += value.r;
    }

    // Take average
    color = sum / float(width);
}
