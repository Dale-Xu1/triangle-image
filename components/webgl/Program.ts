import Buffer from "./Buffer"

export default class Program
{

    private program: WebGLProgram
    private array: WebGLVertexArrayObject


    public constructor(private gl: WebGL2RenderingContext, vertex: Shader, fragment: Shader)
    {
        let program = this.program = gl.createProgram()!
        this.array = gl.createVertexArray()!

        // Link program
        gl.attachShader(program, vertex.shader)
        gl.attachShader(program, fragment.shader)

        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            let log = gl.getProgramInfoLog(program)!
            gl.deleteProgram(program)

            throw log
        }
        
        this.use()
    }


    public use(): void
    {
        let gl = this.gl

        gl.useProgram(this.program)
        gl.bindVertexArray(this.array)
    }


    public bindAttribute(name: string, buffer: Buffer): void
    {
        let gl = this.gl

        let attribute = gl.getAttribLocation(this.program, name)
        buffer.bind()
        
        // Instruct how to read data from buffer to attribute
        gl.enableVertexAttribArray(attribute)
        gl.vertexAttribPointer(attribute, buffer.length, buffer.type, buffer.normalized, 0, 0)
    }

    public uniformLocation(name: string): WebGLUniformLocation
    {
        return this.gl.getUniformLocation(this.program, name)!
    }
 
}

export class Shader
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
