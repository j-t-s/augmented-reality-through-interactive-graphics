import java.awt.Color;
import java.awt.Point;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.util.ArrayDeque;
import java.util.Collection;
import java.util.Deque;

import javax.swing.Timer;

public class PhysicsEngine implements ActionListener{
	private boolean gravity = true;
	private BufferedImage currentFrame;
	private int fps = 30;
	private Timer timer;
	private Deque<AREntity> entities = new ArrayDeque<>();
	private EdgeData edgeData;
	private EdgeFilter edgeFilter;
	private InputHandler inHandler;
	
	public PhysicsEngine(InputHandler ih) {
		this(ih, 30);
	}
	public PhysicsEngine(InputHandler ih, int fps){
		this.fps = fps;
		this.inHandler = ih;
		
		BufferedImage bi = currentFrame = ih.getFrame();
		edgeFilter = new EdgeFilter(bi.getWidth(), bi.getHeight());
		timer = new Timer(1000/fps, this);
		
	} 
	
	public void toogleGravity(){
		gravity = !gravity;
	}

	public void run(){
		timer.start();
	}
	public void pause(){
		timer.stop();
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		// TODO Auto-generated method stub
		update();
	}
	
	public void addAREntity(AREntity are){
		entities.push(are);
	}
	public void addAREntities(Collection<AREntity> ares){
		entities.addAll(ares);
	}
	public boolean removeAREntity(AREntity are){
		return entities.remove(are);
	}
	
	
	private void update(){
		currentFrame = inHandler.getFrame();
		for(AREntity are: entities){
			
			//Collision Detection and Handling
			if (testCollision(are, true)){
				
				/*
				BufferedImage subImage = currentFrame.getSubimage(are.pos.x - 1, are.pos.y - 1, are.width + 2, are.height + 2);
				//edgeData = EdgeFilterHolder.getEdgeFilter(are.width + 2, are.height + 2).getEdgeData(subImage, are.pos.x - 1, are.pos.y - 1);
				//EdgeData ed = EdgeFilterHolder.getEdgeFilter(are.width + 2, are.height + 2).getEdgeData(currentFrame, are.pos.x - 1, are.pos.y - 1);//edgeData;//EdgeFilterHolder.getEdgeFilter(40, 40).getEdgeData(bi, 100, 100);
				EdgeData ed = edgeData;
				System.out.printf("ed %dx%d%n", ed.width, ed.height);
				BufferedImage out = new BufferedImage(ed.width, ed.height, BufferedImage.TYPE_4BYTE_ABGR);
				System.out.printf("outbi %dx%d%n", out.getWidth(), out.getHeight());
				java.awt.Graphics2D g2d = out.createGraphics();
				
				g2d.setColor(Color.BLACK);
				g2d.drawRect(are.pos.x-1, are.pos.y-1, are.width+2, are.height+2);
								
				for (int y = 0; y < ed.height; y++){
					for (int x = 0; x < ed.width; x++){
						if ( 
							ed.dataX[EdgeFilter.xyToPos(x, y, ed.width)] > 0 ||
							ed.dataY[EdgeFilter.xyToPos(x, y, ed.width)] > 0
						){
							//System.out.println("x "+x+":y "+y);
							//out.setRGB(x, y, 0xFFFFFFFF);
							
							//g2d.drawString(".", x, y);
							g2d.drawRect(x, y, 1, 1);
						}
					}
				}
				
				javax.swing.JOptionPane.showMessageDialog(null, "", "FromPhysicsEngine", javax.swing.JOptionPane.PLAIN_MESSAGE, new javax.swing.ImageIcon(out));
				*/
				
				findFirstCollision(are);
				
				double edgeY = are.edgeYSum/are.collisionCount;
				double edgeX = are.edgeXSum/are.collisionCount;
				
				double ballAngle = Math.atan2(are.vel.y, are.vel.x);
				double ballSpeed = Math.sqrt(are.vel.y*are.vel.y + are.vel.x*are.vel.x);
				
				double normal = Math.atan2(edgeY,edgeX);
				double ballReflectAngle = 2*normal - ballAngle;
				
				are.vel.y = (int) -Math.floor(Math.sin(ballReflectAngle)*ballSpeed*are.damp);
				are.vel.x = (int) -Math.floor(Math.cos(ballReflectAngle)*ballSpeed*are.damp);
				
			}
			
			
			//Prevent the ball from going faster than the terminal velocity
			if (are.vel.y > are.terminalVel.y){are.vel.y = are.terminalVel.y;}
			if (are.vel.y < -are.terminalVel.y){are.vel.y = -are.terminalVel.y;}
			if (are.vel.x > are.terminalVel.y){are.vel.x = are.terminalVel.y;}
			if (are.vel.x < -are.terminalVel.y){are.vel.x = -are.terminalVel.y;}
					
			//Update Position and velocity
			are.pos.x += are.vel.x;
			are.pos.y += are.vel.y;
			are.vel.y += are.accel.y;
			are.vel.x += are.accel.x;
			
			//Prevent the ball from going outside the top and bottom of the canvas.
			if (are.pos.y < 1 || are.pos.y + are.height + 1 > currentFrame.getHeight()){
				are.vel.y *= -1;
				if (are.pos.y < 1){
					are.pos.y = 1;
				}else{
					are.pos.y = currentFrame.getHeight() - are.height - 1;
				}
			}
			//Prevent the ball from going outside the left and right of the canvas.
			if (are.pos.x < 1 || are.pos.x + are.width + 1 > currentFrame.getWidth()){
				are.vel.x *= -1;
				if (are.pos.x < 1){
					are.pos.x = 1;
				}else{
					are.pos.x = currentFrame.getWidth() - are.width - 1;
				}
			}
			
		}
	}
	
	private boolean testCollision(AREntity are, boolean showCollision){
		are.collisionCount = 0;
		are.edgeXSum = 0;
		are.edgeYSum = 0;
		//Get the subImage that is has one pixel width border around the object.
		//The Sobel Filter producing edge data 2 pixels smaller in width and also in height. 
		//BufferedImage subImage = currentFrame.getSubimage(are.pos.x - 1, are.pos.y - 1, are.width + 2, are.height + 2);
		//javax.swing.JOptionPane.showMessageDialog(null, "", "FromPhysicsEngine", javax.swing.JOptionPane.PLAIN_MESSAGE, new javax.swing.ImageIcon(subImage));
		edgeData = EdgeFilterHolder.getEdgeFilter(are.width + 2, are.height + 2).getEdgeData(currentFrame, are.pos.x - 1, are.pos.y - 1);
		
		for(Point colPoint: are.collisionList){
			int pos = EdgeFilter.xyToPos(colPoint.x, colPoint.y, edgeData.width);
			if (
				edgeData.dataX[pos] > are.collisionThreshold ||
				edgeData.dataX[pos] < -are.collisionThreshold ||
				edgeData.dataY[pos] > are.collisionThreshold ||
				edgeData.dataY[pos] < -are.collisionThreshold
			){
				are.collisionCount++;
				are.edgeXSum += edgeData.dataX[pos];
				are.edgeYSum += edgeData.dataY[pos];
				
				if (showCollision == true){
					//TODO draw the collisions as green pixels
				}
			}
		}
		return are.collisionCount > 0;
	}
	
	private void findFirstCollision(AREntity are){
		int futureX = are.pos.x;
		int futureY = are.pos.y;
		
		are.pos.x -= are.vel.x;
		are.pos.y -= are.vel.y;
		
		double dx = 0;
		double dy = 0;
		
		double areposx = are.pos.x;
		double areposy = are.pos.y;
		
		double velLen = Math.sqrt(are.vel.y * are.vel.y + are.vel.x * are.vel.x);
		
		if (velLen != 0){
			//javax.swing.JOptionPane.showMessageDialog(null, "Pause", "FromPhysicsEngine", javax.swing.JOptionPane.PLAIN_MESSAGE);
			if (velLen == Math.abs(are.vel.x)){//No Y component
				dx = are.vel.x/Math.abs(are.vel.x);
				while (!testCollision(are, false) && are.pos.x != futureX){
					areposx += dx;
					are.pos.x = (int) areposx;
				}
			}else if (velLen == Math.abs(are.vel.y)){//No X component
				dy = are.vel.y/Math.abs(are.vel.y);
				while (!testCollision(are, false) && are.pos.y != futureY){
					areposy += dy;
					are.pos.y = (int) areposy;
				}
			}else{//Diagonal
				if (Math.abs(are.vel.y) > Math.abs(are.vel.x)){
					dx = are.vel.x / Math.abs(are.vel.x);
					dy = are.vel.y / Math.abs(are.vel.y);
				}else{
					dx = are.vel.x / Math.abs(are.vel.x);
					dy = are.vel.y / Math.abs(are.vel.y);
				}
				while (!testCollision(are, false) && are.pos.y != futureY){
					areposx += dx;
					areposy += dy;
					are.pos.x = (int) areposx;
					are.pos.y = (int) areposy;
				}
			}
			//New position of x,y is the first collision location.
			are.pos.x = (int) Math.floor(areposx);
			are.pos.y = (int) Math.floor(areposy);
			//javax.swing.JOptionPane.showMessageDialog(null, String.format("Was %d %d and now %d %d", futureX, futureY, are.pos.x, are.pos.y), "FromPhysicsEngine", javax.swing.JOptionPane.PLAIN_MESSAGE);
			//System.out.println("Got first collision?");
			if (are.collisionCount == 0){
				are.collisionCount = 1;
			}
		}
		
	}

}
