import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
//import java.awt.event.ActionEvent;//TODO remove
//import java.awt.event.ActionListener;//TODO remove

import javax.swing.JPanel;

public class OutputPanel extends JPanel {//implements ActionListener {//TODO remove
	private Image img;
	
	void setImage(Image img){
		this.img = img;
	}
	
	public OutputPanel() {
		
	}

	//@Override//TODO remove
	//public void actionPerformed(ActionEvent evt) {
	//	repaint();
	//}
	public Dimension getPreferredSize() {
		return new Dimension(img.getWidth(null), img.getHeight(null));
	}
	public void paint(Graphics g) {
        super.paint(g);
       	g.drawImage(img, 0, 0, img.getWidth(null), img.getHeight(null), null);
    } 
}
