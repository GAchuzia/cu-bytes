import { StyleSheet } from 'react-native';
import { w, h, font } from './dimensions';

export const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'scroll',
    textAlign: 'center',
    width: w(100),
  },

  headerContainer: {
    width: w(10),
  },

  bodyContainerAlt: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: w(80),
  },

  statusbar: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: h(2.0),
    paddingBottom: (2.0),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    textAlign: 'center',
    width: w(80),
  },

  headerButton: {
    alignItems: 'center',
    backgroundColor: '#131312',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#666666',
    color: 'red',
    paddingTop: h(2.0),
    paddingBottom: h(2.0),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    width: w(10),
  },

  headerButtonText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(150),
    fontWeight: '600',
  },

  headerTitle: {
    backgroundColor: 'blue',//'#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(300),
    fontWeight: '800',
    paddingTop: h(2.0),
    paddingBottom: h(2.0),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(100),
  },

  headerUsernameIcon: {
    backgroundColor: 'blue',//'#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(150),
    fontWeight: '600',
    paddingTop: h(2.0),
    paddingBottom: h(2.0),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(80),
  },

  infoText: {
    backgroundColor: 'green',//'#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(150),
    fontWeight: '600',
    marginTop: h(1.0),
    marginBottom: h(1.0),
    paddingTop: h(2.0),
    paddingBottom: h(2.0),
    paddingLeft: w(2.0),
    paddingRight: w(2.0),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(60),
  },

  bodyButtonDefault: {
    alignItems: 'center',
    backgroundColor: '#131312',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#666666',
    marginTop: h(1.0),
    marginBottom: h(1.0),
    marginLeft: w(0.5),
    marginRight: w(0.5),
    paddingTop: h(5.0),
    paddingBottom: h(5.0),
    paddingLeft: w(5.0),
    paddingRight: w(5.0),
    width: w(20),
  },

  bodyButtonTextDefault: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(200),
    fontWeight: '600',
    textAlign: 'center',
  }

});