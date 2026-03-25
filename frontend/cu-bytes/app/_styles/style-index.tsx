import { StyleSheet } from 'react-native';
import { w, h, font } from './dimensions';

export const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    textAlign: 'center',
    width: w(100),
  },

  scrollView: {
    alignSelf: 'stretch',
    flex: 1,
  },

  scrollContent: {
    alignItems: 'center',
    paddingBottom: h(6.0),
    width: w(100),
  },

  statusbar: {
    alignItems: 'center',
    backgroundColor: '#AB0006',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: h(2.0),
    paddingBottom: h(2.0),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    textAlign: 'center',
    width: w(100),
  },

  /** Layout wrapper — flex on RN Web <Text> can stack one glyph per line in Firefox. */
  headerTitleBox: {
    alignItems: 'center',
    backgroundColor: '#AB0006',
    justifyContent: 'center',
    marginTop: h(1.0),
    marginBottom: h(1.0),
    paddingTop: h(0.5),
    paddingBottom: h(0.5),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    width: w(60),
  },

  headerTitleText: {
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(250),
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },

  infoTextBox: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    justifyContent: 'center',
    marginTop: h(1.0),
    marginBottom: h(1.0),
    paddingTop: h(1.0),
    paddingBottom: h(1.0),
    paddingLeft: w(1.0),
    paddingRight: w(1.0),
    width: w(100),
  },

  infoText: {
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(150),
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },

  bodyButtonDefault: {
    alignItems: 'center',
    backgroundColor: '#131312',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#666666',
    height: h(15),
    justifyContent: 'center',
    marginTop: h(1.0),
    marginBottom: h(1.0),
    marginLeft: w(0.5),
    marginRight: w(0.5),
    paddingTop: h(2.0),
    paddingBottom: h(2.0),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    width: w(80),
  },

  bodyButtonTextDefault: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(175),
    fontWeight: 'bold',
    textAlign: 'center',
  }

});
