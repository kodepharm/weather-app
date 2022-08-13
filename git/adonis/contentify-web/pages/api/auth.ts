// import NextAuth from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'

// import { postRequest } from 'utils/http'

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials, req): Promise<any> {
//         // Call  API to authenticate the user
//         try {
//           const res = await postRequest('/auth/login', credentials)
//           if (res.user && res.token) {
//             return res
//           }
//         } catch (error) {
//           return null
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/auth/login',
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       // If user logged in, pass the token to the client
//       if (user) {
//         token.token = user.token
//         token.user = user.user
//       }

//       return token
//     },
//     async session({ session, token }) {
//       // Add logged in user details and token to the session
//       session.user = token.user
//       session.token = token.token
//       session.expires = token.token.expires_at

//       return session
//     },
//   },
//   debug: true,
// })
