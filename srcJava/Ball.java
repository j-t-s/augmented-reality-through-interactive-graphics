import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;

public class Ball extends AREntity {
	int radius = 10;
	Color colorFill = new Color(1.0f, 165/255f, 0.0f);//Color.ORANGE
	Color colorStroke = new Color(1.0f, 1.0f, 0.0f);//Color.YELLOW
	
	//Constructors
	public Ball(){
		this(10);
	}
	
	public Ball(int radius) {
		this(radius, Color.ORANGE, Color.YELLOW);
	}
	
	public Ball(int radius, Color fill, Color stroke){
		this(radius, fill, stroke, new Point(50, 50), new Point(0, 0), new Point(0, 10), new Point(0, 1), 0.75f, 50);
	}

	public Ball(int radius, Color fill, Color stroke, Point pos, Point vel, Point terminalVel, Point accel, float damp, int collisionThreshold) {
		super(pos, vel, terminalVel, accel, damp, collisionThreshold);
		this.radius = radius;
		this.colorFill = fill;
		this.colorStroke = stroke;
		this.width = radius*2;
		this.height = radius*2;
		createCollisionMask();
	}

	@Override
	protected void createCollisionMask() {
		//this.collisionList;//TODO initialize collisionList to properSize, then remove its initialization in AREntity
		BufferedImage bi = new BufferedImage(this.radius*2, this.radius*2, BufferedImage.TYPE_4BYTE_ABGR);
		Graphics2D g2d = bi.createGraphics();
		
		g2d.setColor(colorFill);
		g2d.fillOval(0, 0, radius*2, radius*2);
		
		g2d.setColor(colorStroke);
		g2d.drawOval(0, 0, radius*2, radius*2);
		
		g2d.dispose();//TODO this needed?
		
		byte[] maskPixels = ((DataBufferByte) bi.getRaster().getDataBuffer()).getData();
		int pos, xv, yv;
		for (int i = 0; i < maskPixels.length; i += 4){
			if ((maskPixels[i] & 0xff) > 254){//If maskPixels[i] == 0xff//TODO just use (maskPixels[i] == 0xff), if works
				pos = i/4;
				xv = pos % bi.getWidth();
				yv = ((pos - xv)/bi.getWidth());
				if ((xv % 2 == 0 && yv % 2 != 0) || (xv % 2 != 0 && yv % 2 == 0)){//Get every other pixel
					this.collisionList.push(new Point(xv, yv));//Half list
				}
				//this.collisionList.push(new Point(xv, yv));//FullList
			}
		}
	}

	@Override
	public void draw(Graphics g) {
		Graphics2D g2d = (Graphics2D)g;
		g2d.setColor(colorFill);
		g2d.fillOval(this.pos.x, this.pos.y, radius*2, radius*2);
		
		g2d.setColor(colorStroke);
		g2d.drawOval(this.pos.x, this.pos.y, radius*2, radius*2);
	}

	@Override
	public void update() {
		// TODO Auto-generated method stub

	}

}
