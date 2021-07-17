import Buffer from "./Buffer"

export default class Program
{

    private program: WebGLProgram
    private array: WebGLVertexArrayObject


    public constructor(private gl: WebGL2RenderingContext, vertex: Shader, fragment: Shader)
    {
        this.program = gl.createProgram()!
        this.array = gl.createVertexArray()!

        // Link program
        gl.attachShader(this.program, vertex.shader)
        gl.attachShader(this.program, fragment.shader)

        gl.linkProgram(this.program)
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
        {
            let log = gl.getProgramInfoLog(this.program)!
            gl.deleteProgram(this.program)

            throw log
        }
        
        this.use()
    }

    public use(): void
    {
        this.gl.useProgram(this.program)
        this.gl.bindVertexArray(this.array)
    }


    public bindAttribute(name: string, buffer: Buffer): void
    {
        let attribute = this.gl.getAttribLocation(this.program, name)
        buffer.bind()
        
        // Instruct how to read data from buffer to attribute
        this.gl.enableVertexAttribArray(attribute)
        this.gl.vertexAttribPointer(attribute, buffer.length, buffer.type, buffer.normalized, 0, 0)
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
