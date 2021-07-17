#version 300 es

in vec2 position;
in vec4 color;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

out vec4 v_color;

void main()
{
    // Convert position to clip space
    vec3 transformed = u_matrix * vec3(position, 1);
    vec2 clip = transformed.xy / u_resolution * 2.0 - 1.0;

    gl_Position = vec4(clip.x, -clip.y, 0, 1);
    v_color = color;
}
