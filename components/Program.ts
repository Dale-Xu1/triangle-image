import Buffer from "./Buffer"
import Color from "./math/Color"
import Matrix3 from "./math/Matrix3"
import Vector2 from "./math/Vector2"

export default class Program
{

    public program: WebGLProgram
    
    public vertex: Shader
    public fragment: Shader

    private position: number
    private color: number

    private matrix: WebGLUniformLocation


    public constructor(private gl: WebGL2RenderingContext, vertex: string, fragment: string)
    {
        // Compile shaders
        this.vertex = new Shader(gl, gl.VERTEX_SHADER, vertex)
        this.fragment = new Shader(gl, gl.FRAGMENT_SHADER, fragment)

        this.program = gl.createProgram()!

        // Link program
        gl.attachShader(this.program, this.vertex.shader)
        gl.attachShader(this.program, this.fragment.shader)

        gl.linkProgram(this.program)
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
        {
            let log = gl.getProgramInfoLog(this.program)!
            gl.deleteProgram(this.program)

            throw log
        }

        // Get attribute and uniform locations
        this.position = gl.getAttribLocation(this.program, "position")
        this.color = gl.getAttribLocation(this.program, "color")

        this.matrix = gl.getUniformLocation(this.program, "u_matrix")!

        // Bind vertex array
        let array = gl.createVertexArray()
        gl.bindVertexArray(array)

        gl.useProgram(this.program)

        // Set resolution
        let resolution = gl.getUniformLocation(this.program, "u_resolution")

        let width = gl.canvas.width
        let height = gl.canvas.height

        gl.viewport(0, 0, width, height)
        gl.uniform2f(resolution, width, height)
    }


    private a = 0

    public draw(): void
    {
        window.requestAnimationFrame(this.draw.bind(this))
        this.a += 0.03

        // Clear canvas
        this.gl.clearColor(0, 0, 0, 0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        // Apply transformations
        let transformation = Matrix3.scale(2, 1).rotate(this.a).translate(200, 100)
        this.gl.uniformMatrix3fv(this.matrix, true, transformation.data)

        let vertices = new Buffer(this.gl, this.gl.FLOAT)
        vertices.write(this.position, [
            new Vector2(0, 0),
            new Vector2(100, 0),
            new Vector2(0, 100),
            new Vector2(0, 100),
            new Vector2(100, 0),
            new Vector2(100, 100)
        ])

        let colors = new Buffer(this.gl, this.gl.UNSIGNED_BYTE, true)
        colors.write(this.color, [
            new Color(255, 0, 0),
            new Color(255, 0, 0),
            new Color(255, 0, 0),
            new Color(255, 0, 0),
            new Color(255, 0, 0),
            new Color(255, 0, 0)
        ])

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
    
}

class Shader
{

    public shader: WebGLShader


    public constructor(gl: WebGL2RenderingContext, type: number, source: string)
    {
        this.shader = gl.createShader(type)!;

        gl.shaderSource(this.shader, source)
        gl.compileShader(this.shader)

        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS))
        {
            let log = gl.getShaderInfoLog(this.shader)!
            gl.deleteShader(this.shader)

            throw log
        }
    }

}
