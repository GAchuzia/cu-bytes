import { StyleSheet } from 'react-native';
import { w, h, font } from './dimensions';

export const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'scroll',
    textAlign: 'center',
    width: w(100),
  },

  statusbar: {
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#C5151A',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: w(4),
    paddingVertical: h(1.5),
    width: w(100),
  },

  bodyButton: {
    alignItems: 'center',
    backgroundColor: '#131312',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#131312',
    marginBottom: h(5),
    padding: h(2.5),
    width: w(80),
  },

  bodyButtonText: {
    backgroundColor: '#131312',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(175),
    fontWeight: '600',
    textAlign: 'center',
  },

  bodyButtonAlt: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginBottom: h(2.5),
    padding: h(2.5),
    shadowColor: '#131312',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 10,
    width: w(80),
  },

  bodyButtonTextAlt: {
    backgroundColor: '#FFFFFF',
    color: '#C5151A',
    fontFamily: 'arial',
    fontSize: font(175),
    fontWeight: '600',
    textAlign: 'center',
  },

  headerTitle: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(350),
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(100),
  },

  infoText: {
    backgroundColor: '#C5151A',
    color: '#FFFFFF',
    fontFamily: 'arial',
    fontSize: font(175),
    fontWeight: '500',
    marginTop: h(0.5),
    paddingTop: h(5),
    paddingBottom: h(5),
    textAlign: 'center',
    textShadowColor: '#131312',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    width: w(100),
  },

});
