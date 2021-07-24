#version 300 es

in vec2 position;
in vec4 color;

uniform mat3 u_matrix;
out vec4 v_color;

void main()
{
    // Transform position
    vec3 transformed = u_matrix * vec3(position, 1);

    gl_Position = vec4(transformed.xy, 0, 1);
    v_color = color;
}
