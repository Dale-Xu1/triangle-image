export default class Program
{

    public program: WebGLProgram
    

    public constructor(gl: WebGL2RenderingContext, vertex: Shader, fragment: Shader)
    {
        this.program = gl.createProgram()!

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

        // Bind vertex array
        let array = gl.createVertexArray()
        gl.bindVertexArray(array)

        gl.useProgram(this.program)
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
