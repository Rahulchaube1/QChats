package banner

import (
	"fmt"
)

func ExampleSay() {
	fmt.Println(Say("hello world!"))
	// Output:
	//           /\
	//      /\  / /\  ______
	//     / /\/ /  \/  |   \                     hello world!
	//    | |  \/   | ()|    |
	//     \ \      |   |____|
	//      \ \      \____/  ____  ________          __
	//       \/       /     / __ \/ ___/ /  ___ ____/ /____
	//       /     __/     / /_/ / /__/ _ \/ _ '/ __/ __(_-<
	//      /_____/        \___\_\___/_//_/\_,_/\__/\__/___/
	//     /__/
}

func ExampleSay_long() {
	fmt.Println(Say(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`))
	// Output:
	//           /\
	//      /\  / /\  ______         Lorem ipsum dolor sit amet, consectetur
	//     / /\/ /  \/  |   \        adipiscing elit, sed do eiusmod tempor
	//    | |  \/   | ()|    |   incididunt ut labore et dolore magna aliqua.
	//     \ \      |   |____|     Ut enim ad minim veniam, quis nostrud [...]
	//      \ \      \____/  ____  ________          __
	//       \/       /     / __ \/ ___/ /  ___ ____/ /____
	//       /     __/     / /_/ / /__/ _ \/ _ '/ __/ __(_-<
	//      /_____/        \___\_\___/_//_/\_,_/\__/\__/___/
	//     /__/
}

func ExampleOfTheDay() {
	fmt.Println(OfTheDay())
}
