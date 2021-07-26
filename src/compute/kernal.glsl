#define KERNAL_SIZE 9
#define KERNAL float[KERNAL_SIZE]
#define DATA vec3[KERNAL_SIZE]

uniform ivec2 u_resolution;

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

DATA getData(sampler2D data, ivec2 location)
{
    int i = location.x;
    int j = location.y;

    return DATA(
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

vec3 convolution(KERNAL kernal, DATA data)
{
    // Performs a convolution, what more can I say?
    vec3 sum;
    for (int i = 0; i < KERNAL_SIZE; i++) sum += data[i] * kernal[i];

    return sum;
}

vec3 convolution(KERNAL kernal, float weight, DATA data)
{
    return convolution(kernal, data) / weight;
}
