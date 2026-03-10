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

  scrollContent: {
    alignItems: 'center',
    paddingBottom: h(6),
    width: w(100),
  },

  scrollView: {
    alignSelf: 'stretch',
    flex: 1,
  },

  headerContainer: {
    width: w(10),
  },

  statusbar: {
    alignItems: 'center',
    backgroundColor: '#AB0006',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: h(1),
    paddingHorizontal: w(2),
    textAlign: 'center',
    width: w(100),
  },

  headerButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131312',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: h(1.2),
    paddingHorizontal: w(3),
    minWidth: w(18),
    maxHeight: h(6),
  },

  headerButtonText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(125),
    fontWeight: '600',
    textAlign: 'center',
  },

  bodyButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(125),
    fontWeight: '600',
    justifyContent: 'center',
  },

  headerTitle: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(280),
    fontWeight: '800',
    justifyContent: 'center',
    marginTop: h(1.0),
    marginBottom: h(1.0),
    paddingTop: h(0.5),
    paddingBottom: h(0.5),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    flex: 1,
  },

  headerUsernameIcon: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(110),
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: w(1),
    maxWidth: w(15),
  },

  infoText: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    flexDirection: 'row',
    fontFamily: 'arial',
    fontSize: font(125),
    fontWeight: '600',
    justifyContent: 'center',
    marginTop: h(1.0),
    marginBottom: h(1.0),
    paddingTop: h(1.0),
    paddingBottom: h(1.0),
    paddingLeft: w(1.0),
    paddingRight: w(1.0),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(80),
  },

  bodyButton: {
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
    width: w(60),
  },

  bodyButtonText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(175),
    fontWeight: '600',
    textAlign: 'center',
  }

});