#version 300 es
precision mediump float;

uniform sampler2D u_difference;
uniform int u_width;

out float color;

void main()
{
    float sum = 0.0;
    for (int i = 0; i < u_width; i++)
    {
        // Sum values
        vec4 value = texelFetch(u_difference, ivec2(i, 0), 0);
        sum += value.r;
    }

    // Take average
    color = sum / float(u_width);
}
