#version 300 es
#define KERNAL_SIZE 9

precision mediump float;

uniform sampler2D u_data;
uniform sampler2D u_target;

uniform ivec2 u_resolution;

uniform float[KERNAL_SIZE] u_sobelX;
uniform float[KERNAL_SIZE] u_sobelY;

out float color;

vec3 getPixel(sampler2D data, int i, int j)
{
    // Constrain index
    if (i < 0) i = 0;
    else if (i >= u_resolution.x) i = u_resolution.x - 1;

    if (j < 0) j = 0;
    else if (j >= u_resolution.y) j = u_resolution.y - 1;

    // Remove alpha channel assuming white background
    vec4 value = texelFetch(data, ivec2(i, j), 0);
    return value.rgb + (1.0 - value.a);
}

vec3[KERNAL_SIZE] getData(sampler2D data, ivec2 location)
{
    int i = location.x;
    int j = location.y;

    return vec3[](
        getPixel(data, i - 1, j - 1),
        getPixel(data, i    , j - 1),
        getPixel(data, i + 1, j - 1),
        getPixel(data, i - 1, j    ),
        getPixel(data, i    , j    ),
        getPixel(data, i + 1, j    ),
        getPixel(data, i - 1, j + 1),
        getPixel(data, i    , j + 1),
        getPixel(data, i + 1, j + 1)
    );
}

vec3 convolution(float[KERNAL_SIZE] kernal, vec3[KERNAL_SIZE] data)
{
    // Performs a convolution, what more can I say?
    vec3 sum;
    for (int i = 0; i < KERNAL_SIZE; i++) sum += data[i] * kernal[i];

    return sum;
}

vec3 sobel(vec3[KERNAL_SIZE] data)
{
    vec3 x = convolution(u_sobelX, data);
    vec3 y = convolution(u_sobelY, data);

    // Magnitude of derivative in the x and y directions
    return sqrt(x * x + y * y);
}

void main()
{
    ivec2 i = ivec2(gl_FragCoord.xy);

    vec3[] data = getData(u_data, i);
    vec3[] target = getData(u_target, i);

    vec3 a = data[4]; // Index 4 is the middle pixel
    vec3 b = target[4];

    vec3 d = sobel(data);
    vec3 t = sobel(target);

    // Calculate difference in colors and edges
    vec3 c = a - b;
    vec3 s = (d - t) * 0.4;

    // Average color channels
    vec3 diff = c * c + s * s;
    color = (diff.r + diff.g + diff.b) / 3.0;
}
