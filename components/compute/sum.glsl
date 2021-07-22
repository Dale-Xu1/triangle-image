#version 300 es
precision mediump float;

uniform sampler2D u_difference;
uniform int u_height;

out float color;

void main()
{
    int x = int(gl_FragCoord.x);
    float sum = 0.0;

    for (int i = 0; i < u_height; i++)
    {
        // Sum values
        vec4 value = texelFetch(u_difference, ivec2(x, i), 0);
        sum += value.r;
    }

    // Take average
    color = sum / float(u_height);
}
